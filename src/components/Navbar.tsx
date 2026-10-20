"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  GraduationCap,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  WifiOff,
  Database,
  Info,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import type { UiLocale } from "@/types/lexicon";

const UI_LOCALE_OPTIONS: { code: UiLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "zh-Hans", label: "简体中文" },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    uiLocale,
    setUiLocale,
    t,
    theme,
    toggleTheme,
    favorites,
    isOffline,
  } = useLexicon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home, icon: BookOpen },
    { href: "/dictionary", label: t.nav.dictionary, icon: Globe },
    { href: "/learn", label: t.nav.learn, icon: GraduationCap },
    {
      href: "/favorites",
      label: t.nav.favorites,
      icon: Bookmark,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    { href: "/about", label: t.nav.about, icon: Info },
    { href: "/sources", label: t.nav.sources, icon: Database },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-200/80 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md">
      {isOffline && (
        <div
          role="status"
          data-testid="offline-banner"
          className="bg-amber-50 dark:bg-amber-950/90 border-b border-amber-200 dark:border-amber-800 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            Offline mode active: Only previously cached pages and the verified
            starter lexicon are available offline.
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-lexicon-500 rounded-lg"
        >
          <div className="w-9 h-9 rounded-lg bg-lexicon-700 dark:bg-lexicon-600 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm group-hover:bg-lexicon-800 transition-colors">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-ink-900 dark:text-white leading-none">
              {t.brand.name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-lexicon-700 dark:text-lexicon-400 mt-0.5">
              Multilingual · Kamus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300"
                    : "text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/70 dark:hover:bg-ink-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    data-testid="nav-favorites-count"
                    className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-lexicon-600 text-white"
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls: UI Language & Theme */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <label htmlFor="ui-locale-select" className="sr-only">
              {t.nav.uiLanguage}
            </label>
            <select
              id="ui-locale-select"
              data-testid="ui-locale-selector"
              value={uiLocale}
              onChange={(e) => setUiLocale(e.target.value as UiLocale)}
              aria-label={t.nav.uiLanguage}
              className="text-xs sm:text-sm font-medium rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 text-ink-800 dark:text-ink-100 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
            >
              {UI_LOCALE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            data-testid="theme-toggle"
            aria-label={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
            title={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
            className="p-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            data-testid="mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          data-testid="mobile-nav-drawer"
          className="md:hidden border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 px-4 py-3 space-y-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300"
                    : "text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-900"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-lexicon-600 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
