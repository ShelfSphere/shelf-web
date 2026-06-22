"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function CTASection() {
  const t = useTranslations("cta");

  const TRUST_KEYS = ["free", "noSetup", "cancel", "noCommission"] as const;

  return (
    <section className="relative py-36 bg-[#0a0a0a] overflow-hidden">
      <BackgroundBeams />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
            {t("label")}
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/sign-up?role=PRODUCT_OWNER"
            className="group px-8 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green-dark transition-all text-sm shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 hover:scale-105 active:scale-95"
          >
            {t("ctaBrand")}
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </Link>
          <Link
            href="/sign-up?role=SUPERMARKET"
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm hover:scale-105 active:scale-95"
          >
            {t("ctaSupermarket")} →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {TRUST_KEYS.map((key, i) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/3 border border-white/8 px-3 py-1 rounded-full"
            >
              <Check size={11} className="text-brand-green flex-shrink-0" strokeWidth={2.5} />
              {t(`trust.${key}`)}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
