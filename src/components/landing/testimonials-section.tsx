"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    quote: t(`items.${i}.quote`),
    name: t(`items.${i}.name`),
    title: t(`items.${i}.title`),
  }));

  return (
    <section className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_50%,rgba(41,128,185,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{t("title")}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <InfiniteMovingCards items={items} direction="left" speed="slow" />
        <div className="mt-4">
          <InfiniteMovingCards items={[...items].reverse()} direction="right" speed="slow" />
        </div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
