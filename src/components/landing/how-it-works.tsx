"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Store, Radio, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEP_ICONS: LucideIcon[] = [Store, Radio, ShoppingBag];
const STEP_STYLES = [
  { color: "from-blue-500/12 to-transparent", border: "border-blue-500/20", iconBg: "bg-blue-500/15", iconColor: "text-blue-400", dot: "bg-blue-400" },
  { color: "from-brand-green/12 to-transparent", border: "border-brand-green/20", iconBg: "bg-brand-green/15", iconColor: "text-brand-green", dot: "bg-brand-green" },
  { color: "from-orange-500/12 to-transparent", border: "border-orange-500/20", iconBg: "bg-orange-500/15", iconColor: "text-orange-400", dot: "bg-orange-400" },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  const steps = [0, 1, 2].map((i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: t(`steps.${i}.title`),
    description: t(`steps.${i}.description`),
    icon: STEP_ICONS[i],
    ...STEP_STYLES[i],
  }));

  return (
    <section id="how-it-works" ref={ref} className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-green/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full bg-gradient-to-b from-blue-500 via-brand-green to-orange-500"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 80 }}
                  className="relative flex gap-8"
                >
                  <div className="relative flex-shrink-0 w-16 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                      className={`w-4 h-4 rounded-full ${step.dot} ring-4 ring-black relative z-10 mt-6`}
                    />
                  </div>

                  <motion.div
                    whileHover={{ x: 6, transition: { duration: 0.2 } }}
                    className={`flex-1 rounded-2xl border ${step.border} bg-gradient-to-br ${step.color} p-7`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} className={step.iconColor} strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-white/15 font-mono tracking-widest">
                            {step.number}
                          </span>
                          <h3 className="font-bold text-white text-lg">{step.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
