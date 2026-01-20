'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

const plans = [
  {
    name: 'FREE',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para probar',
    features: ['50 clientes', '1 programa', '3 cupones', 'Soporte por email'],
    popular: false,
  },
  {
    name: 'BASICO',
    price: '$399',
    currency: 'MXN',
    period: '/mes',
    description: 'Para negocios en crecimiento',
    features: ['500 clientes', '3 programas', 'Geolocalizacion', 'Notificaciones push', 'Soporte prioritario'],
    popular: false,
  },
  {
    name: 'PRO',
    price: '$799',
    currency: 'MXN',
    period: '/mes',
    description: 'Para negocios establecidos',
    features: ['2,000 clientes', '10 programas', 'Analytics avanzado', 'API completa', 'Integraciones', 'Soporte 24/7'],
    popular: true,
  },
  {
    name: 'ENTERPRISE',
    price: '$1,499',
    currency: 'MXN',
    period: '/mes',
    description: 'Para grandes empresas',
    features: ['Clientes ilimitados', 'Programas ilimitados', 'White label', 'Manager dedicado', 'SLA garantizado', 'Onboarding personalizado'],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
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
            Planes simples y{' '}
            <span className="text-mint-600">transparentes</span>
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu negocio. Puedes cambiar en cualquier momento.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'bg-almost-black text-white ring-4 ring-mint-500'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-mint-500 text-almost-black text-xs font-bold px-4 py-1.5 rounded-full">
                    MAS POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-sm font-bold mb-2 ${plan.popular ? 'text-mint-400' : 'text-mint-600'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  {plan.currency && (
                    <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                      {plan.currency}
                    </span>
                  )}
                  <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? 'bg-mint-500' : 'bg-mint-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-almost-black' : 'text-mint-700'}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-charcoal'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="block">
                <Button
                  variant={plan.popular ? 'secondary' : 'primary'}
                  className="w-full"
                >
                  {plan.price === '$0' ? 'Comenzar Gratis' : 'Elegir Plan'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
