"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import { Box, TrendingUp, CalendarRange, ShieldCheck, Zap, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURE_ICONS: LucideIcon[] = [Box, TrendingUp, CalendarRange, ShieldCheck, Zap, ClipboardList];
const FEATURE_STYLES = [
  { iconBg: "bg-brand-green/15", iconColor: "text-brand-green", className: "md:col-span-2 md:row-span-2", highlight: true },
  { iconBg: "bg-orange-500/15", iconColor: "text-orange-400", className: undefined, highlight: false },
  { iconBg: "bg-blue-500/15", iconColor: "text-blue-400", className: undefined, highlight: false },
  { iconBg: "bg-purple-500/15", iconColor: "text-purple-400", className: undefined, highlight: false },
  { iconBg: "bg-yellow-500/15", iconColor: "text-yellow-400", className: undefined, highlight: false },
  { iconBg: "bg-pink-500/15", iconColor: "text-pink-400", className: undefined, highlight: false },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  const features = FEATURE_ICONS.map((icon, i) => ({
    icon,
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    ...FEATURE_STYLES[i],
  }));

  return (
    <section id="features" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <GlowingStarsBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{t("title")}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={cn(
                  "group relative rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden cursor-default",
                  "hover:border-white/12 transition-colors duration-300",
                  feature.highlight && "bg-gradient-to-br from-brand-green/8 to-transparent border-brand-green/15",
                  feature.className
                )}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.04] to-transparent rounded-bl-full pointer-events-none" />

                <div className="relative z-10 h-full flex flex-col gap-4">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", feature.iconBg)}>
                    <Icon size={20} className={feature.iconColor} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="font-bold text-white text-base mb-1.5">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
