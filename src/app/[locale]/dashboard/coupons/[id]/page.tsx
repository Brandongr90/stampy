"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Ticket,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

type DiscountType = "percentage" | "fixed";

export default function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const t = useTranslations("Dashboard.editCoupon");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [termsConditions, setTermsConditions] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState<number | null>(null);

  useEffect(() => {
    async function loadCoupon() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (fetchError || !data) {
        setError(t("notFound"));
        setIsLoading(false);
        return;
      }

      setTitle(data.title);
      setDescription(data.description || "");
      setDiscountType((data.discount_type as DiscountType) || "percentage");
      setDiscountValue(data.discount_value || 0);
      setTermsConditions(data.terms_conditions || "");
      setValidFrom(
        data.valid_from
          ? new Date(data.valid_from).toISOString().split("T")[0]
          : ""
      );
      setValidUntil(
        data.valid_until
          ? new Date(data.valid_until).toISOString().split("T")[0]
          : ""
      );
      setMaxRedemptions(data.max_redemptions);

      setIsLoading(false);
    }

    loadCoupon();
  }, [resolvedParams.id, t]);

  const handleSave = async () => {
    if (!title.trim() || discountValue <= 0) return;

    setIsSaving(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("coupons")
      .update({
        title,
        description: description || null,
        discount_type: discountType,
        discount_value: discountValue,
        terms_conditions: termsConditions || null,
        valid_from: validFrom ? new Date(validFrom).toISOString() : null,
        valid_until: validUntil ? new Date(validUntil).toISOString() : null,
        max_redemptions: maxRedemptions,
      })
      .eq("id", resolvedParams.id);

    if (updateError) {
      setError(t("errors.updateError", { message: updateError.message }));
      setIsSaving(false);
      return;
    }

    router.push("/dashboard/coupons");
  };

  const canSave = title.trim() && discountValue > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/coupons"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToCoupons")}
        </Link>
        <Card className="p-8 text-center">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

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
                onClick={() => setDiscountType("percentage")}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                  discountType === "percentage"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    discountType === "percentage" ? "bg-brand-500" : "bg-gray-100"
                  )}
                >
                  <Percent
                    className={cn(
                      "w-5 h-5",
                      discountType === "percentage" ? "text-white" : "text-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium text-almost-black">{t("percentage")}</p>
                  <p className="text-sm text-gray-500">{t("percentageDesc")}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                  discountType === "fixed"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    discountType === "fixed" ? "bg-brand-500" : "bg-gray-100"
                  )}
                >
                  <DollarSign
                    className={cn(
                      "w-5 h-5",
                      discountType === "fixed" ? "text-white" : "text-gray-500"
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
                {discountType === "percentage" ? "%" : "$"}
              </span>
              <Input
                type="number"
                min="1"
                max={discountType === "percentage" ? 100 : 10000}
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t("validUntil")}
              </label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
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
              value={maxRedemptions || ""}
              onChange={(e) =>
                setMaxRedemptions(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("termsConditions")}
            </label>
            <textarea
              placeholder={t("termsConditionsPlaceholder")}
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
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
                    {discountType === "percentage"
                      ? `${discountValue}%`
                      : `$${discountValue}`}
                  </p>
                  <p className="font-semibold text-almost-black">{title}</p>
                  {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  {discountType === "percentage" ? (
                    <Percent className="w-6 h-6 text-brand-600" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-brand-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Link href="/dashboard/coupons">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToCoupons")}
            </Button>
          </Link>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !canSave}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("save")}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
