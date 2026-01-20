'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Users } from 'lucide-react';
import { EmptyState } from '@/components/dashboard';

const customers = [
  { id: 1, name: 'Maria Garcia', email: 'maria@email.com', points: 2450, level: 'Gold', joined: '15 Ene 2024' },
  { id: 2, name: 'Carlos Lopez', email: 'carlos@email.com', points: 1820, level: 'Silver', joined: '22 Feb 2024' },
  { id: 3, name: 'Ana Martinez', email: 'ana@email.com', points: 3200, level: 'Platinum', joined: '08 Mar 2024' },
  { id: 4, name: 'Pedro Sanchez', email: 'pedro@email.com', points: 890, level: 'Bronze', joined: '14 Abr 2024' },
  { id: 5, name: 'Laura Torres', email: 'laura@email.com', points: 1560, level: 'Silver', joined: '29 May 2024' },
];

const levelColors: Record<string, string> = {
  Bronze: 'bg-orange-100 text-orange-700',
  Silver: 'bg-gray-100 text-gray-700',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-purple-100 text-purple-700',
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay clientes aun"
        description="Cuando tus clientes se registren en tu programa de lealtad, apareceran aqui."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-mint-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Puntos</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nivel</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registro</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
                      <span className="text-mint-700 font-semibold text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-almost-black">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-almost-black">{customer.points.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[customer.level]}`}>
                    {customer.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{customer.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
