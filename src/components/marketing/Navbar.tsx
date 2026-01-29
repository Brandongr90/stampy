"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, LanguageSwitcher } from "@/components/ui";
import logoStampy from "../../../public/assets/logos/imagotipo-n.png";

export function Navbar() {
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoStampy}
              alt="Stampy"
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-charcoal hover:text-almost-black font-medium transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="text-charcoal hover:text-almost-black font-medium transition-colors"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/login"
              className="text-charcoal hover:text-almost-black font-medium transition-colors"
            >
              {t("login")}
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                {t("startFree")}
              </Button>
            </Link>
            <LanguageSwitcher variant="light" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t("toggleMenu")}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-charcoal hover:text-almost-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t("features")}
              </Link>
              <Link
                href="#pricing"
                className="text-charcoal hover:text-almost-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t("pricing")}
              </Link>
              <Link
                href="/login"
                className="text-charcoal hover:text-almost-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {t("login")}
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">
                  {t("startFree")}
                </Button>
              </Link>
              <div className="py-2">
                <LanguageSwitcher variant="light" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
