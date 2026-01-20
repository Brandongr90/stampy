import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-mint-100 rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-mint-700" />
        </div>
        {change && (
          <span
            className={cn(
              'text-sm font-medium px-2.5 py-1 rounded-full',
              isPositive && 'bg-green-100 text-green-700',
              isNegative && 'bg-red-100 text-red-700',
              !isPositive && !isNegative && 'bg-gray-100 text-gray-700'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-display font-bold text-almost-black">{value}</p>
    </div>
  );
}
