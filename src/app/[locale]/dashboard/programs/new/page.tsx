"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Stamp,
  Star,
  Users,
  Gift,
  Palette,
  Eye,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ProgramType = "stamps" | "points" | "visits";

interface ProgramData {
  type: ProgramType;
  name: string;
  description: string;
  rewardThreshold: number;
  rewardDescription: string;
  primaryColor: string;
  secondaryColor: string;
  iconStyle: string;
}

const initialData: ProgramData = {
  type: "stamps",
  name: "",
  description: "",
  rewardThreshold: 10,
  rewardDescription: "",
  primaryColor: "#8B5CF6",
  secondaryColor: "#0F0F0F",
  iconStyle: "coffee",
};

const colorPresets = [
  { primary: "#8B5CF6", secondary: "#FFFFFF", name: "violet" },
  { primary: "#86EFAC", secondary: "#0F0F0F", name: "mint" },
  { primary: "#FCD34D", secondary: "#0F0F0F", name: "yellow" },
  { primary: "#F87171", secondary: "#FFFFFF", name: "coral" },
  { primary: "#60A5FA", secondary: "#0F0F0F", name: "blue" },
  { primary: "#A78BFA", secondary: "#FFFFFF", name: "purple" },
  { primary: "#0F0F0F", secondary: "#FFFFFF", name: "black" },
];

const iconStyles = [
  { id: "coffee", emoji: "☕" },
  { id: "food", emoji: "🍔" },
  { id: "beauty", emoji: "💅" },
  { id: "fitness", emoji: "💪" },
  { id: "shopping", emoji: "🛍️" },
  { id: "star", emoji: "⭐" },
];

export default function NewProgramPage() {
  const router = useRouter();
  const t = useTranslations("Dashboard.newProgram");
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ProgramData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const programTypes = [
    {
      id: "stamps" as ProgramType,
      name: t("step1.stamps.name"),
      description: t("step1.stamps.description"),
      icon: Stamp,
      example: t("step1.stamps.example"),
    },
    {
      id: "points" as ProgramType,
      name: t("step1.points.name"),
      description: t("step1.points.description"),
      icon: Star,
      example: t("step1.points.example"),
    },
    {
      id: "visits" as ProgramType,
      name: t("step1.visits.name"),
      description: t("step1.visits.description"),
      icon: Users,
      example: t("step1.visits.example"),
    },
  ];

  const steps = [
    { id: 1, name: t("steps.type"), icon: Sparkles },
    { id: 2, name: t("steps.reward"), icon: Gift },
    { id: 3, name: t("steps.design"), icon: Palette },
    { id: 4, name: t("steps.preview"), icon: Eye },
  ];

  const updateData = (updates: Partial<ProgramData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!data.type;
      case 2:
        return (
          !!data.name && data.rewardThreshold > 0 && !!data.rewardDescription
        );
      case 3:
        return !!data.primaryColor;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
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

    const { error: insertError } = await supabase
      .from("loyalty_programs")
      .insert({
        business_id: business.id,
        name: data.name,
        description: data.description,
        type: data.type,
        reward_threshold: data.rewardThreshold,
        reward_description: data.rewardDescription,
        design_config: {
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          iconStyle: data.iconStyle,
        },
        is_active: true,
      });

    if (insertError) {
      setError(t("errors.createError", { message: insertError.message }));
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard/programs");
  };

  const typeLabel = programTypes.find((tp) => tp.id === data.type)?.name || "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/programs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToPrograms")}
        </Link>
        <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all",
                  currentStep === step.id
                    ? "bg-brand-500 text-almost-black"
                    : currentStep > step.id
                      ? "bg-brand-500 text-almost-black"
                      : "bg-gray-100 text-gray-400",
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "ml-3 font-medium hidden sm:block",
                  currentStep >= step.id
                    ? "text-almost-black"
                    : "text-gray-400",
                )}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-24 h-1 mx-4 rounded-full",
                    currentStep > step.id ? "bg-brand-500" : "bg-gray-100",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Type Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-almost-black mb-2">
                {t("step1.title")}
              </h2>
              <p className="text-gray-500">{t("step1.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateData({ type: type.id })}
                  className={cn(
                    "p-6 rounded-2xl border-2 text-left transition-all",
                    data.type === type.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      data.type === type.id ? "bg-brand-500" : "bg-gray-100",
                    )}
                  >
                    <type.icon
                      className={cn(
                        "w-6 h-6",
                        data.type === type.id
                          ? "text-almost-black"
                          : "text-gray-500",
                      )}
                    />
                  </div>
                  <h3 className="font-semibold text-almost-black mb-1">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {type.description}
                  </p>
                  <p className="text-xs text-brand-600 font-medium">
                    {type.example}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Reward Configuration */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-almost-black mb-2">
                {t("step2.title")}
              </h2>
              <p className="text-gray-500">{t("step2.subtitle")}</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("step2.programName")}
                </label>
                <Input
                  type="text"
                  placeholder={t("step2.programNamePlaceholder")}
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("step2.description")}
                </label>
                <Input
                  type="text"
                  placeholder={t("step2.descriptionPlaceholder")}
                  value={data.description}
                  onChange={(e) => updateData({ description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("step2.threshold", { type: typeLabel })}
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={data.rewardThreshold}
                    onChange={(e) =>
                      updateData({
                        rewardThreshold: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-24"
                  />
                  <span className="text-gray-500">
                    {typeLabel.toLowerCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("step2.rewardDescription")}
                </label>
                <Input
                  type="text"
                  placeholder={t("step2.rewardDescriptionPlaceholder")}
                  value={data.rewardDescription}
                  onChange={(e) =>
                    updateData({ rewardDescription: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Design */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-almost-black mb-2">
                {t("step3.title")}
              </h2>
              <p className="text-gray-500">{t("step3.subtitle")}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("step3.colorScheme")}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        updateData({
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                        })
                      }
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all",
                        data.primaryColor === preset.primary
                          ? "border-mint-500"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <div
                        className="w-full h-8 rounded-lg mb-2"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span className="text-xs text-gray-600">
                        {t(`step3.colors.${preset.name}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("step3.cardIcon")}
                </label>
                <div className="flex gap-3">
                  {iconStyles.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => updateData({ iconStyle: icon.id })}
                      className={cn(
                        "w-14 h-14 rounded-xl border-2 text-2xl transition-all flex items-center justify-center",
                        data.iconStyle === icon.id
                          ? "border-mint-500 bg-mint-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      {icon.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-almost-black mb-2">
                {t("step4.title")}
              </h2>
              <p className="text-gray-500">{t("step4.subtitle")}</p>
            </div>

            <div className="flex justify-center">
              <div
                className="w-80 rounded-2xl overflow-hidden shadow-xl"
                style={{ backgroundColor: data.primaryColor }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p
                        className="text-sm opacity-80"
                        style={{ color: data.secondaryColor }}
                      >
                        {data.description || t("step4.loyaltyCard")}
                      </p>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: data.secondaryColor }}
                      >
                        {data.name || t("step4.programName")}
                      </h3>
                    </div>
                    <span className="text-3xl">
                      {iconStyles.find((i) => i.id === data.iconStyle)?.emoji}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {Array.from({ length: data.rewardThreshold }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center"
                          style={{
                            borderColor: data.secondaryColor,
                            opacity: i < 3 ? 1 : 0.4,
                          }}
                        >
                          {i < 3 && (
                            <Check
                              className="w-5 h-5"
                              style={{ color: data.secondaryColor }}
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>

                  <div
                    className="text-center py-3 rounded-xl"
                    style={{
                      backgroundColor: data.secondaryColor,
                      color: data.primaryColor,
                    }}
                  >
                    <p className="text-sm font-medium">
                      {data.rewardThreshold} {typeLabel.toLowerCase()} ={" "}
                      {data.rewardDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-almost-black mb-2">
                {t("step4.summary")}
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <strong>{t("step4.type")}:</strong> {typeLabel}
                </li>
                <li>
                  <strong>{t("step4.name")}:</strong> {data.name}
                </li>
                <li>
                  <strong>{t("step4.goal")}:</strong> {data.rewardThreshold}{" "}
                  {typeLabel.toLowerCase()}
                </li>
                <li>
                  <strong>{t("step4.reward")}:</strong> {data.rewardDescription}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("creating") : t("create")}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
