"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Ticket,
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Percent,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, Card, Badge, DropdownMenu, Modal } from "@/components/ui";
import { EmptyState } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Coupon = Database["public"]["Tables"]["coupons"]["Row"];

export default function CouponsPage() {
  const t = useTranslations("Dashboard.coupons");
  const tCommon = useTranslations("Common");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    coupon: Coupon | null;
  }>({ isOpen: false, coupon: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCoupons = async () => {
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
      .from("coupons")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching coupons:", error);
    } else {
      setCoupons(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (coupon: Coupon) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) {
      console.error("Error toggling coupon status:", error);
    } else {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
        )
      );
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteModal.coupon) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", deleteModal.coupon.id);

    if (error) {
      console.error("Error deleting coupon:", error);
    } else {
      setCoupons((prev) =>
        prev.filter((c) => c.id !== deleteModal.coupon?.id)
      );
    }

    setIsDeleting(false);
    setDeleteModal({ isOpen: false, coupon: null });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    }
    return `$${coupon.discount_value}`;
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.valid_until) return false;
    return new Date(coupon.valid_until) < new Date();
  };

  const getStatus = (coupon: Coupon) => {
    if (!coupon.is_active) return "inactive";
    if (isExpired(coupon)) return "expired";
    return "active";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-almost-black">
              {t("title")}
            </h1>
            <p className="text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
        </div>

        <EmptyState
          icon={Ticket}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("createCoupon")}
          actionHref="/dashboard/coupons/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Link href="/dashboard/coupons/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {t("createCoupon")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const status = getStatus(coupon);

          return (
            <Card key={coupon.id} className="relative group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor:
                        coupon.discount_type === "percentage"
                          ? "#EEF2FF"
                          : "#ECFDF5",
                    }}
                  >
                    {coupon.discount_type === "percentage" ? (
                      <Percent className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        status === "active"
                          ? "success"
                          : status === "expired"
                            ? "default"
                            : "default"
                      }
                    >
                      {status === "active"
                        ? t("active")
                        : status === "expired"
                          ? t("expired")
                          : t("inactive")}
                    </Badge>
                    <DropdownMenu
                      trigger={
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      }
                      items={[
                        {
                          label: tCommon("edit"),
                          icon: <Pencil className="w-4 h-4" />,
                          onClick: () => {
                            window.location.href = `/dashboard/coupons/${coupon.id}`;
                          },
                        },
                        {
                          label: coupon.is_active
                            ? t("deactivate")
                            : t("activate"),
                          icon: coupon.is_active ? (
                            <ToggleLeft className="w-4 h-4" />
                          ) : (
                            <ToggleRight className="w-4 h-4" />
                          ),
                          onClick: () => handleToggleActive(coupon),
                        },
                        {
                          label: tCommon("delete"),
                          icon: <Trash2 className="w-4 h-4" />,
                          onClick: () =>
                            setDeleteModal({ isOpen: true, coupon }),
                          variant: "danger" as const,
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-almost-black">
                    {getDiscountDisplay(coupon)}
                  </p>
                  <h3 className="font-semibold text-lg text-almost-black mt-1">
                    {coupon.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {coupon.description || t("noDescription")}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {coupon.valid_until
                        ? t("validUntil", { date: formatDate(coupon.valid_until) })
                        : t("noExpiration")}
                    </span>
                  </div>
                  {coupon.max_redemptions && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {t("redemptions", {
                          current: coupon.current_redemptions || 0,
                          max: coupon.max_redemptions,
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {t("created", {
                      date: formatDate(coupon.created_at),
                    })}
                  </span>
                  <Link
                    href={`/dashboard/coupons/${coupon.id}`}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    {tCommon("edit")}
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, coupon: null })}
        title={t("deleteConfirmTitle")}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {t("deleteConfirmMessage", { title: deleteModal.coupon?.title || "" })}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, coupon: null })}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteCoupon}
              disabled={isDeleting}
              className="!bg-red-600 hover:!bg-red-700"
            >
              {isDeleting ? t("deleting") : tCommon("delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
