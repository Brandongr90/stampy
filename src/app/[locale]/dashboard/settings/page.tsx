"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Bell,
  Shield,
  MapPin,
  Phone,
  Mail,
  Check,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Input, Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface BusinessData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessType: string | null;
  address: string | null;
}

const businessTypes = [
  "restaurant",
  "cafe",
  "retail",
  "beauty",
  "fitness",
  "services",
  "other",
];

export default function SettingsPage() {
  const t = useTranslations("Dashboard.settings");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [address, setAddress] = useState("");

  // Notification preferences (local state for now)
  const [notifications, setNotifications] = useState({
    newCustomers: true,
    redemptions: true,
    weeklySummary: false,
  });

  useEffect(() => {
    async function loadBusiness() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("businesses")
        .select("id, name, email, phone, business_type, address")
        .eq("user_id", user.id)
        .single();

      if (fetchError || !data) {
        setError(t("errors.loadError"));
        setIsLoading(false);
        return;
      }

      setBusiness({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessType: data.business_type,
        address: data.address,
      });

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setBusinessType(data.business_type || "");
      setAddress(data.address || "");

      setIsLoading(false);
    }

    loadBusiness();
  }, [t]);

  const handleSave = async () => {
    if (!business) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        name,
        email,
        phone: phone || null,
        business_type: businessType || null,
        address: address || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id);

    if (updateError) {
      setError(t("errors.saveError"));
      setIsSaving(false);
      return;
    }

    setBusiness({
      ...business,
      name,
      email,
      phone,
      businessType,
      address,
    });

    setSuccessMessage(t("saveSuccess"));
    setIsSaving(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-almost-black">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Business Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("businessInfo")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("businessName")}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("businessNamePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("businessType")}
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="">{t("selectType")}</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`businessTypes.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              {t("contactEmail")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contactEmailPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              {t("phone")}
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              {t("address")}
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("addressPlaceholder")}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !name || !email}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("saveChanges")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("notifications")}
          </h2>
        </div>

        <div className="space-y-1">
          {[
            { key: "newCustomers" as const, label: t("notificationNewCustomers") },
            { key: "redemptions" as const, label: t("notificationRedemptions") },
            { key: "weeklySummary" as const, label: t("notificationWeeklySummary") },
          ].map((notification) => (
            <div
              key={notification.key}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
            >
              <span className="text-almost-black">{notification.label}</span>
              <button
                onClick={() => toggleNotification(notification.key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications[notification.key] ? "bg-brand-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[notification.key]
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-4">{t("notificationsNote")}</p>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            {t("security")}
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-almost-black">{t("changePassword")}</p>
              <p className="text-sm text-gray-500">{t("changePasswordDesc")}</p>
            </div>
            <Button variant="secondary">{t("change")}</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-almost-black">{t("setup2FA")}</p>
              <p className="text-sm text-gray-500">{t("setup2FADesc")}</p>
            </div>
            <Button variant="secondary">{t("setup")}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
