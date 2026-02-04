"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/Spinner";
import { Stamp, Star, MapPin, Smartphone, Apple } from "lucide-react";

interface Program {
  id: string;
  name: string;
  description: string | null;
  type: "stamps" | "points" | "visits";
  reward_threshold: number;
  reward_description: string;
  design_config: {
    color?: string;
    icon?: string;
  } | null;
  is_active: boolean;
  businesses: { id: string; name: string } | null;
}

interface LoyaltyCard {
  id: string;
  serial_number: string;
  current_points: number;
  current_stamps: number;
  qr_code: string;
  status: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; accent: string }> =
  {
    mint: {
      bg: "bg-emerald-500",
      text: "text-white",
      accent: "bg-emerald-600",
    },
    yellow: {
      bg: "bg-amber-400",
      text: "text-gray-900",
      accent: "bg-amber-500",
    },
    coral: { bg: "bg-rose-500", text: "text-white", accent: "bg-rose-600" },
    blue: { bg: "bg-blue-500", text: "text-white", accent: "bg-blue-600" },
    purple: {
      bg: "bg-purple-500",
      text: "text-white",
      accent: "bg-purple-600",
    },
    black: { bg: "bg-gray-900", text: "text-white", accent: "bg-gray-800" },
  };

function getTypeIcon(type: string) {
  switch (type) {
    case "stamps":
      return Stamp;
    case "points":
      return Star;
    case "visits":
      return MapPin;
    default:
      return Star;
  }
}

function getCurrentValue(card: LoyaltyCard, type: string): number {
  if (type === "stamps") return card.current_stamps;
  return card.current_points;
}

export default function CardPage() {
  const params = useParams();
  const programId = params.programId as string;
  const t = useTranslations("Customer.card");

  const [program, setProgram] = useState<Program | null>(null);
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadProgram() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("loyalty_programs")
        .select("*, businesses(id, name)")
        .eq("id", programId)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setError("not_found");
      } else {
        setProgram(data as unknown as Program);
      }
      setLoading(false);
    }
    loadProgram();
  }, [programId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError(t("errors.nameRequired"));
      return;
    }
    if (!email.trim()) {
      setFormError(t("errors.emailRequired"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError(t("errors.emailInvalid"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${window.location.origin}/api/customer/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programId,
            name,
            email,
            phone: phone || undefined,
          }),
        },
      );

      if (!res.ok) {
        setFormError(t("errors.registrationFailed"));
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setCard(data.card);
      if (data.program) {
        setProgram(data.program);
      }
    } catch {
      setFormError(t("errors.registrationFailed"));
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error === "not_found" || !program) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("programNotFound")}
        </h1>
        <p className="text-gray-500">{t("programNotFoundDesc")}</p>
      </div>
    );
  }

  const colorKey = program.design_config?.color || "blue";
  const colors = COLOR_MAP[colorKey] || COLOR_MAP.blue;
  const TypeIcon = getTypeIcon(program.type);

  // STATE 2: Card view
  if (card) {
    const current = getCurrentValue(card, program.type);
    const total = program.reward_threshold;
    const percentage = Math.min((current / total) * 100, 100);

    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {t("cardTitle")}
        </h2>

        {/* Card */}
        <div
          className={`${colors.bg} ${colors.text} rounded-2xl p-6 shadow-lg mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">{program.businesses?.name}</p>
              <h3 className="text-xl font-bold">{program.name}</h3>
            </div>
            <TypeIcon className="w-8 h-8 opacity-80" />
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t("progress")}</span>
              <span>
                {t("progressDetail", {
                  current,
                  total,
                  type: t(`types.${program.type}`),
                })}
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="text-sm opacity-80">
            {t("rewardLabel")}: {program.reward_description}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center mb-6">
          {card.qr_code && (
            <img
              src={card.qr_code}
              alt="QR Code"
              className="w-48 h-48 mx-auto mb-3"
            />
          )}
          <p className="text-sm text-gray-500 mb-1">{t("scanQR")}</p>
          <p className="text-xs text-gray-400">
            {t("serialNumber")}: {card.serial_number.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Wallet buttons */}
        <div className="space-y-3">
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium opacity-60 cursor-not-allowed"
          >
            <Apple className="w-5 h-5" />
            {t("addToAppleWallet")}
            <span className="text-xs opacity-60 ml-1">
              ({t("walletComingSoon")})
            </span>
          </button>
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 py-3 rounded-xl font-medium opacity-60 cursor-not-allowed"
          >
            <Smartphone className="w-5 h-5" />
            {t("addToGoogleWallet")}
            <span className="text-xs opacity-60 ml-1">
              ({t("walletComingSoon")})
            </span>
          </button>
        </div>
      </div>
    );
  }

  // STATE 1: Registration
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Program preview card */}
      <div
        className={`${colors.bg} ${colors.text} rounded-2xl p-6 shadow-lg mb-6`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">{program.businesses?.name}</p>
            <h3 className="text-xl font-bold">{program.name}</h3>
          </div>
          <TypeIcon className="w-8 h-8 opacity-80" />
        </div>
        {program.description && (
          <p className="text-sm opacity-80 mb-3">{program.description}</p>
        )}
        <div className="flex gap-4 text-sm">
          <div>
            <span className="opacity-60">{t("typeLabel")}:</span>{" "}
            <span className="font-medium capitalize">
              {t(`types.${program.type}`)}
            </span>
          </div>
          <div>
            <span className="opacity-60">{t("goalLabel")}:</span>{" "}
            <span className="font-medium">{program.reward_threshold}</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="opacity-60">{t("rewardLabel")}:</span>{" "}
          <span className="font-medium">{program.reward_description}</span>
        </div>
      </div>

      {/* Registration form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {t("registerTitle")}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{t("registerSubtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("nameField")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("emailField")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("phoneField")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
          >
            {submitting ? t("submitting") : t("submitButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
