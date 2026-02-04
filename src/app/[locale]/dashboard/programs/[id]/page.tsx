"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Stamp,
  Star,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { use } from "react";

type LoyaltyProgram = Database["public"]["Tables"]["loyalty_programs"]["Row"];
type ProgramType = "stamps" | "points" | "visits";

interface DesignConfig {
  primaryColor: string;
  secondaryColor: string;
  iconStyle: string;
}

const colorPresets = [
  { primary: "#3b82f6", secondary: "#FFFFFF", name: "blue" },
  { primary: "#10b981", secondary: "#0F0F0F", name: "green" },
  { primary: "#FCD34D", secondary: "#0F0F0F", name: "yellow" },
  { primary: "#F87171", secondary: "#FFFFFF", name: "coral" },
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

const programTypeIcons = {
  stamps: Stamp,
  points: Star,
  visits: Users,
};

export default function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const t = useTranslations("Dashboard.editProgram");
  const tPrograms = useTranslations("Dashboard.programs");

  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rewardThreshold, setRewardThreshold] = useState(10);
  const [rewardDescription, setRewardDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [iconStyle, setIconStyle] = useState("coffee");

  const programTypeLabels = {
    stamps: tPrograms("types.stamps"),
    points: tPrograms("types.points"),
    visits: tPrograms("types.visits"),
  };

  useEffect(() => {
    async function loadProgram() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("loyalty_programs")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (fetchError || !data) {
        setError(t("notFound"));
        setIsLoading(false);
        return;
      }

      setProgram(data);
      setName(data.name);
      setDescription(data.description || "");
      setRewardThreshold(data.reward_threshold);
      setRewardDescription(data.reward_description || "");

      const designConfig = data.design_config as DesignConfig | null;
      if (designConfig) {
        setPrimaryColor(designConfig.primaryColor || "#3b82f6");
        setSecondaryColor(designConfig.secondaryColor || "#FFFFFF");
        setIconStyle(designConfig.iconStyle || "coffee");
      }

      setIsLoading(false);
    }

    loadProgram();
  }, [resolvedParams.id, t]);

  const handleSave = async () => {
    if (!program) return;

    setIsSaving(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("loyalty_programs")
      .update({
        name,
        description: description || null,
        reward_threshold: rewardThreshold,
        reward_description: rewardDescription,
        design_config: {
          primaryColor,
          secondaryColor,
          iconStyle,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", program.id);

    if (updateError) {
      setError(t("errors.updateError", { message: updateError.message }));
      setIsSaving(false);
      return;
    }

    router.push("/dashboard/programs");
  };

  const canSave = name.trim() && rewardThreshold > 0 && rewardDescription.trim();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/programs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToPrograms")}
        </Link>
        <Card className="p-8 text-center">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!program) return null;

  const TypeIcon =
    programTypeIcons[program.type as keyof typeof programTypeIcons] || Stamp;
  const typeLabel =
    programTypeLabels[program.type as keyof typeof programTypeLabels] ||
    program.type;

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <TypeIcon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {tPrograms("types.stamps") === typeLabel
                    ? "Stamps"
                    : tPrograms("types.points") === typeLabel
                      ? "Points"
                      : "Visits"}
                </p>
                <p className="font-medium text-almost-black">{typeLabel}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("programName")}
                </label>
                <Input
                  type="text"
                  placeholder={t("programNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("threshold", { type: typeLabel })}
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={rewardThreshold}
                    onChange={(e) =>
                      setRewardThreshold(parseInt(e.target.value) || 1)
                    }
                    className="w-24"
                  />
                  <span className="text-gray-500">{typeLabel.toLowerCase()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("rewardDescription")}
                </label>
                <Input
                  type="text"
                  placeholder={t("rewardDescriptionPlaceholder")}
                  value={rewardDescription}
                  onChange={(e) => setRewardDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-almost-black mb-4">
              {t("colorScheme")}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    primaryColor === preset.primary
                      ? "border-brand-500"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-2"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="text-xs text-gray-600">
                    {t(`colors.${preset.name}`)}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-almost-black mb-4">
              {t("cardIcon")}
            </h3>
            <div className="flex gap-3">
              {iconStyles.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setIconStyle(icon.id)}
                  className={cn(
                    "w-14 h-14 rounded-xl border-2 text-2xl transition-all flex items-center justify-center",
                    iconStyle === icon.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/dashboard/programs">
              <Button variant="ghost">{t("backToPrograms")}</Button>
            </Link>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !canSave}
            >
              {isSaving ? t("saving") : t("save")}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="font-semibold text-almost-black mb-4">
              {t("preview")}
            </h3>
            <div className="flex justify-center">
              <div
                className="w-full max-w-xs rounded-2xl overflow-hidden shadow-xl"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p
                        className="text-sm opacity-80"
                        style={{ color: secondaryColor }}
                      >
                        {description || t("description")}
                      </p>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: secondaryColor }}
                      >
                        {name || t("programName")}
                      </h3>
                    </div>
                    <span className="text-3xl">
                      {iconStyles.find((i) => i.id === iconStyle)?.emoji}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {Array.from({ length: Math.min(rewardThreshold, 10) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center"
                          style={{
                            borderColor: secondaryColor,
                            opacity: i < 3 ? 1 : 0.4,
                          }}
                        >
                          {i < 3 && (
                            <Check
                              className="w-5 h-5"
                              style={{ color: secondaryColor }}
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div
                    className="text-center py-3 rounded-xl"
                    style={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                    }}
                  >
                    <p className="text-sm font-medium">
                      {rewardThreshold} {typeLabel.toLowerCase()} ={" "}
                      {rewardDescription || "Reward"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
