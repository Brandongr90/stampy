'use client';

import { TrendingUp, TrendingDown, Users, Gift, CreditCard, Target } from 'lucide-react';
import { StatCard } from '@/components/dashboard';

const monthlyData = [
  { month: 'Ene', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 68 },
  { month: 'Abr', value: 85 },
  { month: 'May', value: 92 },
  { month: 'Jun', value: 88 },
];

export default function AnalyticsPage() {
  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Nuevos Clientes"
          value="234"
          change="+18.2%"
          icon={Users}
        />
        <StatCard
          title="Canjes Totales"
          value="1,847"
          change="+12.5%"
          icon={Gift}
        />
        <StatCard
          title="Valor Promedio"
          value="$45.20"
          change="+5.3%"
          icon={CreditCard}
        />
        <StatCard
          title="Tasa de Conversion"
          value="24.8%"
          change="-2.1%"
          icon={Target}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
          <h3 className="text-lg font-display font-bold text-almost-black mb-6">
            Clientes por Mes
          </h3>
          <div className="flex items-end justify-between h-48 gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-mint-500 rounded-t-lg transition-all duration-300 hover:bg-mint-600"
                  style={{ height: `${(data.value / maxValue) * 100}%` }}
                />
                <span className="text-sm text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rewards */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
          <h3 className="text-lg font-display font-bold text-almost-black mb-6">
            Recompensas Populares
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Cafe Gratis', redeemed: 456, percentage: 85 },
              { name: '20% Descuento', redeemed: 342, percentage: 70 },
              { name: 'Postre Gratis', redeemed: 287, percentage: 58 },
              { name: '2x1 en Bebidas', redeemed: 198, percentage: 42 },
            ].map((reward, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-almost-black">{reward.name}</span>
                  <span className="text-sm text-gray-500">{reward.redeemed} canjes</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-mint-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${reward.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <h3 className="text-lg font-display font-bold text-almost-black mb-6">
          Metricas de Rendimiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-display font-bold text-almost-black">87%</span>
            </div>
            <p className="text-sm text-gray-500">Retencion de Clientes</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-display font-bold text-almost-black">4.2x</span>
            </div>
            <p className="text-sm text-gray-500">ROI del Programa</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-display font-bold text-almost-black">12%</span>
            </div>
            <p className="text-sm text-gray-500">Tasa de Abandono</p>
          </div>
        </div>
      </div>
    </div>
  );
}
