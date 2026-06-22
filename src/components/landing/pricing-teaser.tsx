"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronsDown, ArrowLeftRight, Eye, ChevronsUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PRICE = 15;
const TIER_META: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  gradient: string;
  border: string;
  glow: string;
  badge: boolean;
  barColor: string;
  from: number;
}[] = [
  { icon: ChevronsDown, iconBg: "bg-slate-700/50", iconColor: "text-slate-400", gradient: "from-slate-800/60 to-slate-900/60", border: "border-slate-700/40", glow: "", badge: false, barColor: "bg-slate-500", from: 2 },
  { icon: ArrowLeftRight, iconBg: "bg-blue-500/15", iconColor: "text-blue-400", gradient: "from-blue-900/30 to-slate-900/60", border: "border-blue-700/30", glow: "hover:shadow-blue-500/10", badge: false, barColor: "bg-blue-500", from: 5 },
  { icon: Eye, iconBg: "bg-brand-green/15", iconColor: "text-brand-green", gradient: "from-brand-green/15 to-slate-900/60", border: "border-brand-green/30", glow: "hover:shadow-brand-green/20", badge: true, barColor: "bg-brand-green", from: 12 },
  { icon: ChevronsUp, iconBg: "bg-purple-500/15", iconColor: "text-purple-400", gradient: "from-purple-900/30 to-slate-900/60", border: "border-purple-700/30", glow: "hover:shadow-purple-500/10", badge: false, barColor: "bg-purple-500", from: 7 },
];

function TierCard({ meta, i, full, description, from, perDay, mostPopular }: {
  meta: (typeof TIER_META)[number];
  i: number;
  full: string;
  description: string;
  from: string;
  perDay: string;
  mostPopular: string;
}) {
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 80 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn(
        "relative rounded-2xl border bg-gradient-to-b p-6 flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 cursor-default",
        meta.gradient, meta.border, meta.glow
      )}
    >
      {meta.badge && (
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 200 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-brand-green text-white px-3 py-0.5 rounded-full whitespace-nowrap shadow-lg shadow-brand-green/30"
        >
          {mostPopular}
        </motion.span>
      )}

      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", meta.iconBg)}>
        <Icon size={20} className={meta.iconColor} strokeWidth={1.75} />
      </div>

      <div>
        <h3 className="font-bold text-white text-base">{full}</h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{from}</span>
          <span className="text-2xl font-extrabold text-white">
            ${meta.from}
            <span className="text-xs font-normal text-gray-500">{perDay}</span>
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(meta.from / MAX_PRICE) * 100}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
            className={cn("h-full rounded-full", meta.barColor)}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function PricingTeaser() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(46,204,113,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIER_META.map((meta, i) => (
            <TierCard
              key={i}
              meta={meta}
              i={i}
              full={t(`tiers.${i}.full`)}
              description={t(`tiers.${i}.description`)}
              from={t("from")}
              perDay={t("perDay")}
              mostPopular={t("mostPopular")}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-gray-700 mt-8"
        >
          {t("note")}
        </motion.p>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
