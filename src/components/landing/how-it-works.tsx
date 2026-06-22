"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "🏪",
    title: "Supermarkets map their halls",
    description:
      "Use our 3D hall editor to recreate your store layout. Define shelf sections with exact dimensions, positions, and tier-based daily pricing.",
    color: "from-blue-500/15 to-transparent",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    dot: "bg-blue-400",
  },
  {
    number: "02",
    icon: "🟢",
    title: "Available shelves go live",
    description:
      "Green-highlighted shelves signal real-time availability. The moment a booking is confirmed, the shelf instantly turns red across all views.",
    color: "from-brand-green/15 to-transparent",
    border: "border-brand-green/20",
    iconBg: "bg-brand-green/10",
    dot: "bg-brand-green",
  },
  {
    number: "03",
    icon: "📦",
    title: "Brands discover & book",
    description:
      "Product owners filter by tier, price, and location, explore the 3D layout, then book a date range instantly — no back-and-forth needed.",
    color: "from-orange-500/15 to-transparent",
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
    dot: "bg-orange-400",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="how-it-works" ref={ref} className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glow */}
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
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            From empty shelf to sold-out product
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">Three steps. Zero phone calls.</p>
        </motion.div>

        {/* Timeline layout */}
        <div className="relative max-w-3xl mx-auto">
          {/* Animated vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full bg-gradient-to-b from-blue-500 via-brand-green to-orange-500"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 80 }}
                className="relative flex gap-8"
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 w-16 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                    className={`w-4 h-4 rounded-full ${step.dot} ring-4 ring-black relative z-10 mt-6`}
                  />
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className={`flex-1 rounded-2xl border ${step.border} bg-gradient-to-br ${step.color} p-7 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-white/20 font-mono">{step.number}</span>
                        <h3 className="font-bold text-white text-lg">{step.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
