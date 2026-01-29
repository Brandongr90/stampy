"use client";

import { useState } from "react";
import { Building2, Bell, Shield, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/ui";

export default function SettingsPage() {
  const t = useTranslations("Dashboard.settings");
  const [businessName, setBusinessName] = useState("Mi Negocio");
  const [email, setEmail] = useState("contacto@minegocio.com");

  return (
    <div className="max-w-4xl space-y-8">
      {/* Business Info */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("businessInfo")}
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("businessName")}
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t("businessNamePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contactEmail")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contactEmailPlaceholder")}
            />
          </div>
          <Button variant="primary">{t("saveChanges")}</Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("notifications")}
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { label: t("notificationNewCustomers"), enabled: true },
            { label: t("notificationRedemptions"), enabled: true },
            { label: t("notificationWeeklySummary"), enabled: false },
            { label: t("notificationLowInventory"), enabled: true },
          ].map((notification, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-almost-black">{notification.label}</span>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  notification.enabled ? "bg-brand-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notification.enabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("security")}
          </h2>
        </div>
        <div className="space-y-4">
          <Button variant="secondary">{t("changePassword")}</Button>
          <Button variant="secondary">{t("setup2FA")}</Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("appearance")}
          </h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t("primaryColor")}
          </label>
          <div className="flex gap-3">
            {["#3b82f6", "#10b981", "#F472B6", "#FBBF24", "#8B5CF6"].map(
              (color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
