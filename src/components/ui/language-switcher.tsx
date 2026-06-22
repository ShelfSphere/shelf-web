"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
  hy: "HY",
};

const FULL_LABELS: Record<string, string> = {
  en: "English",
  ru: "Русский",
  hy: "Հայerĕn",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (next: string) => {
    // Swap the locale segment in the path
    const segments = pathname.split("/");
    if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || "/");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <Globe size={14} className="flex-shrink-0" />
        <span className="font-medium">{LABELS[locale]}</span>
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
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
            {routing.locales.map((loc) => (
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
                {loc === locale && <Check size={13} className="text-brand-green" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
