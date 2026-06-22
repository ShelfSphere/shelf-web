"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "🗺️",
    title: "3D hall editor",
    description:
      "Drag-and-drop shelf placement inside an interactive Three.js scene. Green = available, Red = booked. Rotate, zoom, and click any shelf.",
  },
  {
    icon: "💰",
    title: "Tier-based pricing",
    description:
      "Eye-level shelves command premium rates. Set price per day per shelf — bottom, middle, eye-level, or top — and let the market decide.",
  },
  {
    icon: "📅",
    title: "Date-range bookings",
    description:
      "Brands pick start and end dates. Overlapping bookings are blocked automatically. No double bookings, ever.",
  },
  {
    icon: "🔐",
    title: "Google & email auth",
    description:
      "Sign up in seconds with Google or classic email/password. Separate roles and dashboards for supermarkets and brands.",
  },
  {
    icon: "📊",
    title: "Real-time availability",
    description:
      "Shelf status updates the moment a booking is confirmed. Always accurate across all dashboards.",
  },
  {
    icon: "🧾",
    title: "Full booking history",
    description:
      "Audit trail for both sides — supermarkets track revenue; brands track campaigns and cancellations.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Everything you need
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Built for both sides of the shelf marketplace.
          </p>
        </motion.div>

        <HoverEffect
          items={FEATURES.map((f) => ({ ...f, icon: <span>{f.icon}</span> }))}
          className="mt-8"
        />
      </div>
    </section>
  );
}
