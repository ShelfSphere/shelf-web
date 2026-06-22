"use client";

import { motion } from "framer-motion";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import {
  Box,
  TrendingUp,
  CalendarRange,
  ShieldCheck,
  Zap,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  className?: string;
  highlight?: boolean;
}

const FEATURES: Feature[] = [
  {
    icon: Box,
    title: "3D hall editor",
    description:
      "Drag-and-drop shelf placement in an interactive Three.js scene. Rotate, zoom, and click any shelf to manage it.",
    iconBg: "bg-brand-green/15",
    iconColor: "text-brand-green",
    className: "md:col-span-2 md:row-span-2",
    highlight: true,
  },
  {
    icon: TrendingUp,
    title: "Tier-based pricing",
    description:
      "Eye-level shelves command premium rates. Set price per day per shelf.",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
  },
  {
    icon: CalendarRange,
    title: "Date-range bookings",
    description:
      "Overlap detection prevents double bookings automatically.",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Google & email auth",
    description:
      "Sign up with Google or email. Separate roles for each user type.",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Real-time availability",
    description:
      "Shelf status updates the moment a booking lands.",
    iconBg: "bg-yellow-500/15",
    iconColor: "text-yellow-400",
  },
  {
    icon: ClipboardList,
    title: "Booking history",
    description:
      "Full audit trail for supermarkets and brands.",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden cursor-default",
        "hover:border-white/12 transition-colors duration-300",
        feature.highlight &&
          "bg-gradient-to-br from-brand-green/8 to-transparent border-brand-green/15",
        feature.className
      )}
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />

      {/* Top-right corner shine */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.04] to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col gap-4">
        {/* Icon */}
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
}

export function FeaturesSection() {
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
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Everything you need
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Built for both sides of the shelf marketplace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
