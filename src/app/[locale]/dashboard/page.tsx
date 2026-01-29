"use client";

import { Users, Gift, TrendingUp, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/dashboard";

export default function DashboardPage() {
  const t = useTranslations("Dashboard.home");

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("totalCustomers")}
          value="1,847"
          change="+12.5%"
          icon={Users}
        />
        <StatCard
          title={t("pointsRedeemed")}
          value="24,521"
          change="+8.2%"
          icon={Gift}
        />
        <StatCard
          title={t("retentionRate")}
          value="87.3%"
          change="+3.1%"
          icon={TrendingUp}
        />
        <StatCard
          title={t("recurringRevenue")}
          value="$12,430"
          change="+15.3%"
          icon={CreditCard}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <h2 className="text-xl font-display font-bold text-almost-black mb-6">
          {t("recentActivity")}
        </h2>
        <div className="space-y-4">
          {[
            {
              name: "Maria Garcia",
              action: t("activities.redeemed", { points: 500 }),
              time: t("timeAgo.minutes", { count: 5 }),
            },
            {
              name: "Carlos Lopez",
              action: t("activities.registered"),
              time: t("timeAgo.minutes", { count: 12 }),
            },
            {
              name: "Ana Martinez",
              action: t("activities.levelUp", { level: "Gold" }),
              time: t("timeAgo.minutes", { count: 25 }),
            },
            {
              name: "Pedro Sanchez",
              action: t("activities.couponRedeemed"),
              time: t("timeAgo.hours", { count: 1 }),
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-700 font-semibold text-sm">
                    {activity.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-almost-black">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
