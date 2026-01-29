"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale("es")}
        className={cn(
          "px-2 py-1 text-sm font-medium rounded-lg transition-colors",
          locale === "es"
            ? variant === "light"
              ? "bg-brand-500 text-almost-black"
              : "bg-brand-500 text-almost-black"
            : variant === "light"
              ? "text-charcoal hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/10",
        )}
      >
        ES
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "px-2 py-1 text-sm font-medium rounded-lg transition-colors",
          locale === "en"
            ? variant === "light"
              ? "bg-brand-500 text-almost-black"
              : "bg-brand-500 text-almost-black"
            : variant === "light"
              ? "text-charcoal hover:bg-gray-100"
              : "text-gray-400 hover:text-white hover:bg-white/10",
        )}
      >
        EN
      </button>
    </div>
  );
}
