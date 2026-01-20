'use client';

import { useState } from 'react';
import { Building2, Bell, Shield, Palette } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('Mi Negocio');
  const [email, setEmail] = useState('contacto@minegocio.com');

  return (
    <div className="max-w-4xl space-y-8">
      {/* Business Info */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-mint-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            Informacion del Negocio
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Negocio
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Nombre de tu negocio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contacto
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <Button variant="primary">Guardar Cambios</Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-mint-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            Notificaciones
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Nuevos clientes registrados', enabled: true },
            { label: 'Canjes de recompensas', enabled: true },
            { label: 'Resumen semanal', enabled: false },
            { label: 'Alertas de bajo inventario', enabled: true },
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-almost-black">{notification.label}</span>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  notification.enabled ? 'bg-mint-500' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notification.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-mint-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            Seguridad
          </h2>
        </div>
        <div className="space-y-4">
          <Button variant="secondary">Cambiar Contrasena</Button>
          <Button variant="secondary">Configurar 2FA</Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-mint-700" />
          </div>
          <h2 className="text-lg font-display font-bold text-almost-black">
            Apariencia
          </h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Principal
          </label>
          <div className="flex gap-3">
            {['#86EFAC', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA'].map((color) => (
              <button
                key={color}
                className="w-10 h-10 rounded-xl border-2 border-white shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
