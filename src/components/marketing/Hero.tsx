"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Blob */}
      <div className="blob-brand -top-32 -right-32" />
      <div
        className="blob-brand -bottom-32 -left-32"
        style={{ animationDelay: "-10s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-[60%_40%] gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-almost-black leading-tight mb-6">
              {t("title")}{" "}
              <span className="text-brand-600">{t("titleHighlight")}</span>{" "}
              {t("titleSuffix")}
            </h1>
            <p className="text-lg sm:text-xl text-charcoal mb-8 max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  variant="primary"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {t("cta")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="secondary" className="w-full sm:w-auto">
                  {t("viewFeatures")}
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">{t("noCreditCard")}</p>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative lg:scale-90 lg:origin-right">
              {/* Phone Frame */}
              <div className="w-72 h-[580px] bg-almost-black rounded-[3rem] p-3 shadow-large">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-almost-black rounded-b-2xl" />

                  {/* Card Preview */}
                  <div className="pt-12 px-4">
                    <div className="bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl p-6 text-white shadow-medium">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold">{t("cardTitle")}</p>
                          <p className="text-sm text-white/80">
                            {t("cardSubtitle")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">{t("points")}</span>
                          <span className="font-bold">850</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white rounded-full h-2 w-3/4" />
                        </div>
                        <p className="text-xs text-white/70">
                          {t("pointsToReward")}
                        </p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-6">
                      <p className="text-sm font-medium text-charcoal mb-3">
                        {t("recentActivity")}
                      </p>
                      <div className="space-y-3">
                        {[
                          {
                            action: t("activity1Action"),
                            desc: t("activity1Desc"),
                            time: t("activity1Time"),
                          },
                          {
                            action: t("activity2Action"),
                            desc: t("activity2Desc"),
                            time: t("activity2Time"),
                          },
                          {
                            action: t("activity3Action"),
                            desc: t("activity3Desc"),
                            time: t("activity3Time"),
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <p className="text-sm font-medium text-almost-black">
                                {item.action}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.desc}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -left-8 top-24 bg-white rounded-2xl shadow-large p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🎉</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-almost-black">
                      +1,234
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("customersThisMonth")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
