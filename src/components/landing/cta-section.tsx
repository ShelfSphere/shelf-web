"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";

const TRUST = ["✓ Free to list", "✓ No setup fees", "✓ Cancel anytime", "✓ No commission"];

export function CTASection() {
  return (
    <section className="relative py-36 bg-[#0a0a0a] overflow-hidden">
      <BackgroundBeams />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
            Get started for free
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Ready to find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue">
              perfect shelf?
            </span>
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Join supermarkets and product owners already using Shelf to grow their
            business. Setup takes under 5 minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/sign-up?role=PRODUCT_OWNER"
            className="group px-8 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green-dark transition-all text-sm shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 hover:scale-105 active:scale-95"
          >
            I&apos;m a brand
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </Link>
          <Link
            href="/sign-up?role=SUPERMARKET"
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm hover:scale-105 active:scale-95"
          >
            I&apos;m a supermarket →
          </Link>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {TRUST.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="text-xs text-gray-500 bg-white/3 border border-white/8 px-3 py-1 rounded-full"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
