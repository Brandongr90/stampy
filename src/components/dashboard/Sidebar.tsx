"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Ticket,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/programs", label: "Programas", icon: CreditCard },
  { href: "/dashboard/coupons", label: "Cupones", icon: Ticket },
  { href: "/dashboard/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/notifications", label: "Notificaciones", icon: Bell },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-almost-black text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-mint-500 text-almost-black"
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
          <p className="text-sm text-gray-300 mb-2">Plan Actual</p>
          <p className="font-semibold text-mint-400">FREE</p>
          <p className="text-xs text-gray-400 mt-1">0 / 50 clientes</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div
              className="bg-mint-500 rounded-full h-1.5"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}
