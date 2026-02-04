"use client";

import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  ScanLine,
  Ticket,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "./SidebarProvider";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Dashboard.sidebar");
  const { isOpen, close } = useSidebar();

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/programs", label: t("programs"), icon: CreditCard },
    { href: "/dashboard/scan", label: t("scan"), icon: ScanLine },
    { href: "/dashboard/coupons", label: t("coupons"), icon: Ticket },
    { href: "/dashboard/customers", label: t("customers"), icon: Users },
    { href: "/dashboard/notifications", label: t("notifications"), icon: Bell },
    { href: "/dashboard/analytics", label: t("analytics"), icon: BarChart3 },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-almost-black text-white flex flex-col z-40 transition-transform duration-300 md:translate-x-0 border-r border-white/10",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={close}
          >
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Image
                src="/assets/logos/isotipo-b.png"
                alt="Brand Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
            <Image
              src="/assets/logos/imagotipo-b.png"
              alt="Stampy"
              width={75}
              height={25}
              className="h-6 w-auto object-contain"
            />
          </Link>
          <button
            onClick={close}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                      isActive
                        ? "bg-brand-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-300 mb-2">{t("currentPlan")}</p>
            <p className="font-semibold text-brand-400">FREE</p>
            <p className="text-xs text-gray-400 mt-1">
              {t("customersUsage", { used: 0, limit: 50 })}
            </p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
              <div
                className="bg-brand-500 rounded-full h-1.5"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
