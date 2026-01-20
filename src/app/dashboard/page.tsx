'use client';

import { Users, Gift, TrendingUp, CreditCard } from 'lucide-react';
import { StatCard } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clientes"
          value="1,847"
          change="+12.5%"
          icon={Users}
        />
        <StatCard
          title="Puntos Canjeados"
          value="24,521"
          change="+8.2%"
          icon={Gift}
        />
        <StatCard
          title="Tasa de Retencion"
          value="87.3%"
          change="+3.1%"
          icon={TrendingUp}
        />
        <StatCard
          title="Ingresos Recurrentes"
          value="$12,430"
          change="+15.3%"
          icon={CreditCard}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <h2 className="text-xl font-display font-bold text-almost-black mb-6">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Maria Garcia', action: 'canjeo 500 puntos', time: 'Hace 5 min' },
            { name: 'Carlos Lopez', action: 'se registro al programa', time: 'Hace 12 min' },
            { name: 'Ana Martinez', action: 'alcanzo nivel Gold', time: 'Hace 25 min' },
            { name: 'Pedro Sanchez', action: 'canjeo un cupon', time: 'Hace 1 hora' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
                  <span className="text-mint-700 font-semibold text-sm">
                    {activity.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-almost-black">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
