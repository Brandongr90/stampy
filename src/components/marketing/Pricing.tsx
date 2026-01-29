"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";

export function Pricing() {
  const t = useTranslations("Pricing");

  const plans = [
    {
      name: t("free.name"),
      price: t("free.price"),
      period: t("monthly"),
      description: t("free.description"),
      features: [
        t("free.feature1"),
        t("free.feature2"),
        t("free.feature3"),
        t("free.feature4"),
      ],
      popular: false,
      isFree: true,
    },
    {
      name: t("basic.name"),
      price: t("basic.price"),
      currency: t("basic.currency"),
      period: t("monthly"),
      description: t("basic.description"),
      features: [
        t("basic.feature1"),
        t("basic.feature2"),
        t("basic.feature3"),
        t("basic.feature4"),
        t("basic.feature5"),
      ],
      popular: false,
      isFree: false,
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      currency: t("pro.currency"),
      period: t("monthly"),
      description: t("pro.description"),
      features: [
        t("pro.feature1"),
        t("pro.feature2"),
        t("pro.feature3"),
        t("pro.feature4"),
        t("pro.feature5"),
        t("pro.feature6"),
      ],
      popular: true,
      isFree: false,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      currency: t("enterprise.currency"),
      period: t("monthly"),
      description: t("enterprise.description"),
      features: [
        t("enterprise.feature1"),
        t("enterprise.feature2"),
        t("enterprise.feature3"),
        t("enterprise.feature4"),
        t("enterprise.feature5"),
        t("enterprise.feature6"),
      ],
      popular: false,
      isFree: false,
    },
  ];

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
            {t("title")}{" "}
            <span className="text-brand-600">{t("titleHighlight")}</span>
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            {t("subtitle")}
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
                  ? "bg-almost-black text-white ring-4 ring-brand-500"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-500 text-almost-black text-xs font-bold px-4 py-1.5 rounded-full">
                    {t("mostPopular")}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-sm font-bold mb-2 ${plan.popular ? "text-brand-400" : "text-brand-600"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold">
                    {plan.price}
                  </span>
                  {plan.currency && (
                    <span
                      className={`text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {plan.currency}
                    </span>
                  )}
                  <span
                    className={`text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? "bg-brand-500" : "bg-brand-100"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${plan.popular ? "text-almost-black" : "text-brand-700"}`}
                      />
                    </div>
                    <span
                      className={`text-sm ${plan.popular ? "text-gray-300" : "text-charcoal"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="block">
                <Button
                  variant={plan.popular ? "secondary" : "primary"}
                  className="w-full"
                >
                  {plan.isFree ? t("startFree") : t("choosePlan")}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
