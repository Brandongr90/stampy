"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("Auth.login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? t("invalidCredentials")
          : authError.message,
      );
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-12"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t("passwordPlaceholder")}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="pl-12 pr-12"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-charcoal">{t("rememberMe")}</span>
        </label>
        <Link
          href="#"
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t("submitting") : t("submit")}
      </Button>

      <p className="text-center text-sm text-charcoal">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
