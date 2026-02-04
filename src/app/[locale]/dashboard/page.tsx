"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Layers, Activity, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatCard, EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalCustomers: number;
  activeCards: number;
  activePrograms: number;
  totalStampsGiven: number;
}

interface RecentActivity {
  id: string;
  eventType: string;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard.home");
  const tPrograms = useTranslations("Dashboard.programs");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPrograms, setHasPrograms] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!business) {
        setIsLoading(false);
        return;
      }

      const [
        customersResult,
        cardsResult,
        programsResult,
        transactionsResult,
        activityResult,
      ] = await Promise.all([
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id),
        supabase
          .from("loyalty_cards")
          .select("id, program_id", { count: "exact" })
          .eq("status", "active"),
        supabase
          .from("loyalty_programs")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id)
          .eq("is_active", true),
        supabase
          .from("transactions")
          .select("stamps_change, points_change")
          .eq("business_id", business.id),
        supabase
          .from("analytics_events")
          .select(
            `
            id,
            event_type,
            created_at,
            metadata,
            customer:customers(name, email)
          `,
          )
          .eq("business_id", business.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const totalStamps =
        transactionsResult.data?.reduce((sum, t) => {
          return sum + (t.stamps_change || 0) + (t.points_change || 0);
        }, 0) || 0;

      const programsCount = programsResult.count || 0;
      setHasPrograms(programsCount > 0);

      setStats({
        totalCustomers: customersResult.count || 0,
        activeCards: cardsResult.count || 0,
        activePrograms: programsCount,
        totalStampsGiven: totalStamps,
      });

      const activities: RecentActivity[] =
        activityResult.data?.map((event) => {
          const customerData = event.customer as unknown;
          const customer = Array.isArray(customerData)
            ? (customerData[0] as { name: string; email: string } | undefined)
            : (customerData as { name: string; email: string } | null);
          return {
            id: event.id,
            eventType: event.event_type,
            customerName: customer?.name || null,
            customerEmail: customer?.email || null,
            createdAt: event.created_at as string,
            metadata: event.metadata as Record<string, unknown> | null,
          };
        }) || [];

      setRecentActivity(activities);
      setIsLoading(false);
    }

    loadDashboardData();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return t("timeAgo.minutes", { count: diffMins || 1 });
    } else if (diffHours < 24) {
      return diffHours === 1
        ? t("timeAgo.hours", { count: 1 })
        : t("timeAgo.hoursPlural", { count: diffHours });
    } else {
      return t("timeAgo.days", { count: diffDays });
    }
  };

  const getActivityDescription = (activity: RecentActivity) => {
    switch (activity.eventType) {
      case "pass_created":
        return t("activities.registered");
      case "stamp_added":
        return t("activities.stampAdded");
      case "points_added":
        return t("activities.pointsAdded", {
          points: (activity.metadata?.points as number) || 0,
        });
      case "reward_redeemed":
        return t("activities.redeemed", {
          points: (activity.metadata?.points as number) || 0,
        });
      case "pass_installed":
        return t("activities.passInstalled");
      default:
        return activity.eventType;
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasPrograms) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-almost-black">
            {t("welcome")}
          </h1>
          <p className="text-gray-500 mt-1">{t("welcomeSubtitle")}</p>
        </div>

        <EmptyState
          icon={Layers}
          title={t("noPrograms")}
          description={t("noProgramsDescription")}
          actionLabel={tPrograms("createProgram")}
          actionHref="/dashboard/programs/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Link href="/dashboard/programs/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {tPrograms("createProgram")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("totalCustomers")}
          value={stats?.totalCustomers.toLocaleString() || "0"}
          icon={Users}
        />
        <StatCard
          title={t("activeCards")}
          value={stats?.activeCards.toLocaleString() || "0"}
          icon={CreditCard}
        />
        <StatCard
          title={t("activePrograms")}
          value={stats?.activePrograms.toLocaleString() || "0"}
          icon={Layers}
        />
        <StatCard
          title={t("stampsGiven")}
          value={stats?.totalStampsGiven.toLocaleString() || "0"}
          icon={Activity}
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <h2 className="text-xl font-display font-bold text-almost-black mb-6">
          {t("recentActivity")}
        </h2>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("noActivity")}</p>
            <p className="text-sm text-gray-400 mt-1">
              {t("noActivityDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 font-semibold text-sm">
                      {getInitials(
                        activity.customerName,
                        activity.customerEmail,
                      )}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-almost-black truncate">
                      {activity.customerName ||
                        activity.customerEmail ||
                        t("unknownCustomer")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getActivityDescription(activity)}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {getTimeAgo(activity.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
