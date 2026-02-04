"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Ticket,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type DiscountType = "percentage" | "fixed";

interface CouponData {
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  termsConditions: string;
  validFrom: string;
  validUntil: string;
  maxRedemptions: number | null;
}

const initialData: CouponData = {
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: 10,
  termsConditions: "",
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: "",
  maxRedemptions: null,
};

export default function NewCouponPage() {
  const router = useRouter();
  const t = useTranslations("Dashboard.newCoupon");
  const [data, setData] = useState<CouponData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (updates: Partial<CouponData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canSubmit =
    data.title.trim() && data.discountValue > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("errors.notAuthenticated"));
      setIsSubmitting(false);
      return;
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!business) {
      setError(t("errors.businessNotFound"));
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("coupons").insert({
      business_id: business.id,
      title: data.title,
      description: data.description || null,
      discount_type: data.discountType,
      discount_value: data.discountValue,
      terms_conditions: data.termsConditions || null,
      valid_from: data.validFrom ? new Date(data.validFrom).toISOString() : null,
      valid_until: data.validUntil ? new Date(data.validUntil).toISOString() : null,
      max_redemptions: data.maxRedemptions,
      current_redemptions: 0,
      is_active: true,
    });

    if (insertError) {
      setError(t("errors.createError", { message: insertError.message }));
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard/coupons");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/coupons"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToCoupons")}
        </Link>
        <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <Card className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("discountType")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateData({ discountType: "percentage" })}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                  data.discountType === "percentage"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    data.discountType === "percentage"
                      ? "bg-brand-500"
                      : "bg-gray-100"
                  )}
                >
                  <Percent
                    className={cn(
                      "w-5 h-5",
                      data.discountType === "percentage"
                        ? "text-white"
                        : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium text-almost-black">
                    {t("percentage")}
                  </p>
                  <p className="text-sm text-gray-500">{t("percentageDesc")}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateData({ discountType: "fixed" })}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                  data.discountType === "fixed"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    data.discountType === "fixed" ? "bg-brand-500" : "bg-gray-100"
                  )}
                >
                  <DollarSign
                    className={cn(
                      "w-5 h-5",
                      data.discountType === "fixed"
                        ? "text-white"
                        : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium text-almost-black">{t("fixed")}</p>
                  <p className="text-sm text-gray-500">{t("fixedDesc")}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("discountValue")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {data.discountType === "percentage" ? "%" : "$"}
              </span>
              <Input
                type="number"
                min="1"
                max={data.discountType === "percentage" ? 100 : 10000}
                value={data.discountValue}
                onChange={(e) =>
                  updateData({ discountValue: parseFloat(e.target.value) || 0 })
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("couponTitle")}
            </label>
            <Input
              type="text"
              placeholder={t("couponTitlePlaceholder")}
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("description")}
            </label>
            <Input
              type="text"
              placeholder={t("descriptionPlaceholder")}
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
            />
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t("validFrom")}
              </label>
              <Input
                type="date"
                value={data.validFrom}
                onChange={(e) => updateData({ validFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t("validUntil")}
              </label>
              <Input
                type="date"
                value={data.validUntil}
                onChange={(e) => updateData({ validUntil: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">{t("leaveEmptyNoExpiration")}</p>
            </div>
          </div>

          {/* Max Redemptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("maxRedemptions")}
            </label>
            <Input
              type="number"
              min="0"
              placeholder={t("maxRedemptionsPlaceholder")}
              value={data.maxRedemptions || ""}
              onChange={(e) =>
                updateData({
                  maxRedemptions: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
            />
            <p className="text-xs text-gray-400 mt-1">{t("leaveEmptyUnlimited")}</p>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("termsConditions")}
            </label>
            <textarea
              placeholder={t("termsConditionsPlaceholder")}
              value={data.termsConditions}
              onChange={(e) => updateData({ termsConditions: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-almost-black mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              {t("preview")}
            </h4>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-600">
                    {data.discountType === "percentage"
                      ? `${data.discountValue}%`
                      : `$${data.discountValue}`}
                  </p>
                  <p className="font-semibold text-almost-black">
                    {data.title || t("couponTitlePlaceholder")}
                  </p>
                  {data.description && (
                    <p className="text-sm text-gray-500">{data.description}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  {data.discountType === "percentage" ? (
                    <Percent className="w-6 h-6 text-brand-600" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-brand-600" />
                  )}
                </div>
              </div>
              {data.validUntil && (
                <p className="text-xs text-gray-400 mt-2">
                  {t("expiresOn", { date: data.validUntil })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Link href="/dashboard/coupons">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
          </Link>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? t("creating") : t("create")}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
