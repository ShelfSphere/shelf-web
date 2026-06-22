"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LOCALES = ["en", "ru", "hy"] as const;
const LABELS: Record<string, string> = { en: "EN", ru: "RU", hy: "HY" };
const FULL_LABELS: Record<string, string> = {
  en: "English",
  ru: "Русский",
  hy: "Հայerĕn",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (next: string) => {
    if (next === locale) { setOpen(false); return; }
    // Persist in cookie so the server layout re-renders in the right locale
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Update URL: keep current path, set ?lang= (omit for English)
    const url = new URL(window.location.href);
    if (next === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", next);
    }
    window.location.href = url.toString();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-sm"
      >
        <Globe size={13} className="flex-shrink-0" />
        <span className="font-medium tracking-wide">{LABELS[locale]}</span>
        <ChevronDown size={11} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  loc === locale
                    ? "text-brand-green bg-brand-green/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{FULL_LABELS[loc]}</span>
                {loc === locale && <Check size={12} className="text-brand-green" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
