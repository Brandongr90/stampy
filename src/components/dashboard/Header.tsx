'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/programs': 'Programas de Lealtad',
  '/dashboard/programs/new': 'Nuevo Programa',
  '/dashboard/coupons': 'Cupones',
  '/dashboard/customers': 'Clientes',
  '/dashboard/notifications': 'Notificaciones',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Configuracion',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h1 className="text-2xl font-display font-bold text-almost-black">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-64 pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-mint-500 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-mint-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="w-10 h-10 bg-mint-500 rounded-xl flex items-center justify-center hover:bg-mint-600 transition-colors">
          <span className="text-almost-black font-bold text-sm">CF</span>
        </button>
      </div>
    </header>
  );
}
