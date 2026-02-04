"use client";

import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui";
import { useSidebar } from "./SidebarProvider";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.header");
  const { toggle } = useSidebar();

  const pageTitles: Record<string, string> = {
    "/dashboard": t("dashboard"),
    "/dashboard/programs": t("programs"),
    "/dashboard/programs/new": t("newProgram"),
    "/dashboard/coupons": t("coupons"),
    "/dashboard/customers": t("customers"),
    "/dashboard/notifications": t("notifications"),
    "/dashboard/analytics": t("analytics"),
    "/dashboard/settings": t("settings"),
  };

  const title = pageTitles[pathname] || t("dashboard");

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-display font-bold text-almost-black truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-64 pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Language Switcher */}
        <div className="hidden md:block">
          <LanguageSwitcher variant="light" />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center hover:bg-brand-600 transition-colors">
          <span className="text-almost-black font-bold text-sm">CF</span>
        </button>
      </div>
    </header>
  );
}
