"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "🏪",
    title: "Supermarkets map their halls",
    description:
      "Use our 3D hall editor to recreate your store layout. Define shelf sections with exact dimensions, positions, and tier-based daily pricing.",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    number: "02",
    icon: "🟢",
    title: "Available shelves go live",
    description:
      "Green-highlighted shelves signal real-time availability. Your inventory is always accurate — the moment a booking lands, the shelf goes red.",
    color: "from-brand-green/20 to-brand-green/5",
    border: "border-brand-green/20",
    glow: "group-hover:shadow-brand-green/20",
  },
  {
    number: "03",
    icon: "📦",
    title: "Brands discover & book",
    description:
      "Product owners filter by tier, price, and supermarket, explore the 3D view, then book a date range instantly — no back-and-forth needed.",
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20",
    glow: "group-hover:shadow-orange-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Section divider glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            From empty shelf to sold-out product
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Three steps. Zero phone calls.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-blue-500/30 via-brand-green/30 to-orange-500/30" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`group relative rounded-2xl border ${step.border} bg-gradient-to-b ${step.color} p-8 hover:shadow-2xl ${step.glow} transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-5xl font-black text-white/5 select-none">{step.number}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
