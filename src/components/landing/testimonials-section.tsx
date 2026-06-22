"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const TESTIMONIALS = [
  {
    quote: "We listed our shelves in under an hour. The 3D editor made it easy — brands can actually visualize the space before booking.",
    name: "Maria Kowalski",
    title: "Store Manager, FreshMart",
  },
  {
    quote: "Eye-level bookings tripled our sales for that product line within the first month. The pricing transparency is a game changer.",
    name: "James Liu",
    title: "Brand Director, NutriCo",
  },
  {
    quote: "No more emailing back and forth with 12 store managers. I find the shelf, pick the dates, done. Shelf pays for itself in one campaign.",
    name: "Sofia Andersen",
    title: "Marketing Lead, SnackHouse",
  },
  {
    quote: "The booking system just works. Our revenue from shelf rentals went up 40% after switching from manual spreadsheets.",
    name: "David Okafor",
    title: "Operations Director, GreenGrocer",
  },
  {
    quote: "Finally a platform that thinks about supermarkets AND brands equally. The dashboard gives us everything we need.",
    name: "Priya Sharma",
    title: "Category Manager, SpiceRoute",
  },
  {
    quote: "We onboarded 3 new supermarket partners in a week. The 3D shelf view convinced them immediately — no long sales calls.",
    name: "Lucas Ferreira",
    title: "Partnerships, FoodBrand Co",
  },
];

export function TestimonialsSection() {
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
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Loved by supermarkets and brands
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Join hundreds of businesses already using Shelf to grow.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <InfiniteMovingCards items={TESTIMONIALS} direction="left" speed="slow" />
        <div className="mt-4">
          <InfiniteMovingCards items={[...TESTIMONIALS].reverse()} direction="right" speed="slow" />
        </div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
