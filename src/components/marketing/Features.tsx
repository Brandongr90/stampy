'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Bell,
  MapPin,
  QrCode,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Tarjetas Digitales',
    description: 'Tarjetas que se agregan directamente a Apple Wallet y Google Wallet. Siempre accesibles.',
  },
  {
    icon: Bell,
    title: 'Notificaciones Push',
    description: 'Envia promociones y recordatorios directamente a la pantalla de bloqueo de tus clientes.',
  },
  {
    icon: MapPin,
    title: 'Geolocalizacion',
    description: 'Activa notificaciones cuando tus clientes estan cerca de tu negocio.',
  },
  {
    icon: QrCode,
    title: 'Escaneo QR',
    description: 'Acumula y canjea puntos con un simple escaneo. Rapido y sin fricciones.',
  },
  {
    icon: Smartphone,
    title: 'Sin Apps Nativas',
    description: 'Tus clientes no necesitan descargar nada. Funciona con las wallets existentes.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Avanzado',
    description: 'Metricas detalladas sobre el comportamiento de tus clientes y ROI del programa.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-almost-black mb-4">
            Todo lo que necesitas para{' '}
            <span className="text-mint-600">fidelizar</span>
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Herramientas poderosas para crear experiencias de lealtad que tus clientes amaran
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-200"
            >
              <div className="w-14 h-14 bg-mint-100 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-mint-700" />
              </div>
              <h3 className="text-xl font-display font-bold text-almost-black mb-3">
                {feature.title}
              </h3>
              <p className="text-charcoal leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
