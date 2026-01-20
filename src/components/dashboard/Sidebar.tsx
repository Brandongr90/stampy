'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Ticket,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/programs', label: 'Programas', icon: CreditCard },
  { href: '/dashboard/coupons', label: 'Cupones', icon: Ticket },
  { href: '/dashboard/customers', label: 'Clientes', icon: Users },
  { href: '/dashboard/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configuracion', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-almost-black text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mint-500 rounded-xl flex items-center justify-center">
            <span className="text-almost-black font-bold text-xl">S</span>
          </div>
          <span className="font-display font-bold text-xl">Stampy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    isActive
                      ? 'bg-mint-500 text-almost-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
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
          <p className="font-semibold text-mint-400">PRO</p>
          <p className="text-xs text-gray-400 mt-1">1,847 / 2,000 clientes</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div className="bg-mint-500 rounded-full h-1.5" style={{ width: '92%' }} />
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesion</span>
        </Link>
      </div>
    </aside>
  );
}
