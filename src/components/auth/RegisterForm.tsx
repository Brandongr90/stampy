"use client";

import React, { useState } from "react";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("Auth.register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = t("errors.businessNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("errors.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("errors.passwordMinLength");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const supabase = createClient();

    // 1. Create user in Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          business_name: formData.businessName,
        },
      },
    });

    if (authError) {
      setErrors({
        general:
          authError.message === "User already registered"
            ? t("errors.userExists")
            : authError.message,
      });
      setIsLoading(false);
      return;
    }

    // Business is created automatically via database trigger
    // using the business_name from user metadata

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <div className="relative">
        <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={t("businessNamePlaceholder")}
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          className="pl-12"
          error={errors.businessName}
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-12"
          error={errors.email}
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t("passwordPlaceholder")}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="pl-12 pr-12"
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder={t("confirmPasswordPlaceholder")}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="pl-12 pr-12"
          error={errors.confirmPassword}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          required
        />
        <span className="text-sm text-charcoal">
          {t("termsPrefix")}{" "}
          <Link href="#" className="text-brand-600 hover:text-brand-700">
            {t("termsOfService")}
          </Link>{" "}
          {t("termsMiddle")}{" "}
          <Link href="#" className="text-brand-600 hover:text-brand-700">
            {t("privacyPolicy")}
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t("submitting") : t("submit")}
      </Button>

      <p className="text-center text-sm text-charcoal">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
