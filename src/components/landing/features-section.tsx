"use client";

import { motion } from "framer-motion";
import { BentoGrid } from "@/components/ui/bento-grid";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";

const FEATURES = [
  {
    icon: "🗺️",
    title: "3D hall editor",
    description: "Drag-and-drop shelf placement in an interactive Three.js scene. Rotate, zoom, and click any shelf.",
    className: "md:col-span-2 md:row-span-2",
    highlight: true,
  },
  {
    icon: "💰",
    title: "Tier-based pricing",
    description: "Eye-level shelves command premium rates. Set price per day per shelf.",
    className: "",
  },
  {
    icon: "📅",
    title: "Date-range bookings",
    description: "Overlap detection prevents double bookings automatically.",
    className: "",
  },
  {
    icon: "🔐",
    title: "Google & email auth",
    description: "Sign up with Google or email. Separate roles for each user type.",
    className: "",
  },
  {
    icon: "📊",
    title: "Real-time availability",
    description: "Shelf status updates the moment a booking lands.",
    className: "",
  },
  {
    icon: "🧾",
    title: "Booking history",
    description: "Full audit trail for supermarkets and brands.",
    className: "",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Stars background */}
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

        <BentoGrid items={FEATURES} />
      </div>
    </section>
  );
}
