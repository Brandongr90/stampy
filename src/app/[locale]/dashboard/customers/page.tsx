"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Stamp,
  Star,
  Calendar,
  MoreHorizontal,
  Eye,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/dashboard";
import { Badge, DropdownMenu } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface CustomerWithCard {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  lastVisit: string | null;
  totalVisits: number;
  card: {
    id: string;
    currentStamps: number;
    currentPoints: number;
    status: string;
    programName: string;
    programType: string;
  } | null;
}

export default function CustomersPage() {
  const t = useTranslations("Dashboard.customers");
  const tCommon = useTranslations("Common");
  const [customers, setCustomers] = useState<CustomerWithCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadCustomers() {
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

      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          id,
          name,
          email,
          phone,
          created_at,
          last_visit,
          total_visits,
          loyalty_cards (
            id,
            current_stamps,
            current_points,
            status,
            loyalty_programs (
              name,
              type
            )
          )
        `
        )
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading customers:", error);
        setIsLoading(false);
        return;
      }

      const formattedCustomers: CustomerWithCard[] = (data || []).map(
        (customer) => {
          const cardsData = customer.loyalty_cards as unknown;
          const cards = cardsData as Array<{
            id: string;
            current_stamps: number;
            current_points: number;
            status: string;
            loyalty_programs: unknown;
          }> | null;

          const firstCard = cards?.[0];
          const programData = firstCard?.loyalty_programs;
          const program = Array.isArray(programData)
            ? programData[0] as { name: string; type: string } | undefined
            : programData as { name: string; type: string } | null;

          return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            createdAt: customer.created_at as string,
            lastVisit: customer.last_visit as string | null,
            totalVisits: customer.total_visits || 0,
            card: firstCard
              ? {
                  id: firstCard.id,
                  currentStamps: firstCard.current_stamps || 0,
                  currentPoints: firstCard.current_points || 0,
                  status: firstCard.status || "active",
                  programName: program?.name || "",
                  programType: program?.type || "stamps",
                }
              : null,
          };
        }
      );

      setCustomers(formattedCustomers);
      setIsLoading(false);
    }

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search)
    );
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressValue = (customer: CustomerWithCard) => {
    if (!customer.card) return 0;
    if (customer.card.programType === "points") {
      return customer.card.currentPoints;
    }
    return customer.card.currentStamps;
  };

  const getProgressLabel = (customer: CustomerWithCard) => {
    if (!customer.card) return "-";
    if (customer.card.programType === "points") {
      return `${customer.card.currentPoints} ${t("points")}`;
    }
    return `${customer.card.currentStamps} ${t("stamps")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <EmptyState
          icon={Users}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="text-sm text-gray-500">
          {t("totalCount", { count: filteredCustomers.length })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                {t("tableHeaders.customer")}
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                {t("tableHeaders.program")}
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                {t("tableHeaders.progress")}
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                {t("tableHeaders.status")}
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                {t("tableHeaders.registered")}
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-700 font-semibold text-sm">
                        {getInitials(customer.name, customer.email)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-almost-black">
                        {customer.name || t("noName")}
                      </p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {customer.card ? (
                    <div className="flex items-center gap-2">
                      {customer.card.programType === "stamps" ? (
                        <Stamp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-700">
                        {customer.card.programName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-almost-black">
                    {getProgressLabel(customer)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {customer.card ? (
                    <Badge
                      variant={
                        customer.card.status === "active" ? "success" : "default"
                      }
                    >
                      {customer.card.status === "active"
                        ? t("statusActive")
                        : t("statusInactive")}
                    </Badge>
                  ) : (
                    <Badge variant="default">{t("noCard")}</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDate(customer.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    trigger={
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    }
                    items={[
                      {
                        label: t("viewDetails"),
                        icon: <Eye className="w-4 h-4" />,
                        onClick: () => {
                          // TODO: Implementar vista detallada
                          console.log("View customer:", customer.id);
                        },
                      },
                      {
                        label: t("sendEmail"),
                        icon: <Mail className="w-4 h-4" />,
                        onClick: () => {
                          if (customer.email) {
                            window.location.href = `mailto:${customer.email}`;
                          }
                        },
                        disabled: !customer.email,
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("noResults")}</p>
            <p className="text-sm text-gray-400 mt-1">
              {t("noResultsDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
