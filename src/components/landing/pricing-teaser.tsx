"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    tier: "Bottom shelf",
    icon: "⬇️",
    description: "Floor level. Budget-friendly, great for large or heavy items.",
    from: "$2",
    gradient: "from-slate-800/80 to-slate-900/80",
    border: "border-slate-700/50",
    accent: "text-slate-400",
    badge: null,
  },
  {
    tier: "Middle shelf",
    icon: "↔️",
    description: "Mid-height. Balanced visibility and price for growing brands.",
    from: "$5",
    gradient: "from-blue-900/40 to-slate-900/80",
    border: "border-blue-700/30",
    accent: "text-blue-400",
    badge: null,
  },
  {
    tier: "Eye-level",
    icon: "👁️",
    description: "Premium placement. Proven to drive the highest conversion.",
    from: "$12",
    gradient: "from-brand-green/20 to-slate-900/80",
    border: "border-brand-green/30",
    accent: "text-brand-green",
    badge: "Most popular",
  },
  {
    tier: "Top shelf",
    icon: "⬆️",
    description: "Above eye-level. Great for tall, aspirational products.",
    from: "$7",
    gradient: "from-purple-900/40 to-slate-900/80",
    border: "border-purple-700/30",
    accent: "text-purple-400",
    badge: null,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Shelf pricing by tier
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Each supermarket sets their own daily rate. These are typical starting
            prices across our network.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl border bg-gradient-to-b p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300",
                t.gradient,
                t.border
              )}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-brand-green text-white px-3 py-0.5 rounded-full whitespace-nowrap">
                  {t.badge}
                </span>
              )}
              <div className="text-3xl">{t.icon}</div>
              <div>
                <h3 className="font-bold text-white text-base">{t.tier}</h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{t.description}</p>
              </div>
              <div className={cn("text-3xl font-extrabold mt-auto", t.accent)}>
                {t.from}
                <span className="text-sm font-normal text-gray-500"> / day</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Prices set by individual supermarkets. Final rates may vary.
        </p>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
