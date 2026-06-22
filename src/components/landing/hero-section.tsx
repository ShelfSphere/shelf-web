"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { Meteors } from "@/components/ui/meteors";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const STATS = [
  { target: 500, suffix: "+", label: "Supermarkets" },
  { target: 12000, suffix: "+", label: "Shelf listings", prefix: "" },
  { target: 2000, suffix: "+", label: "Brands" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden pt-20">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <Spotlight className="top-10 left-full" fill="#2ECC71" />
      <Spotlight className="top-28 left-80" fill="#2980B9" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial fade center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(46,204,113,0.08),transparent)]" />

      <div className="absolute inset-0 overflow-hidden">
        <Meteors number={14} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 py-20">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse inline-block" />
            Shelf marketplace — now live
          </motion.div>

          <TextGenerateEffect
            words="Put your products on the right shelf"
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight"
            duration={0.5}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Supermarkets list their shelf space in 3D. Brands discover and book
            premium eye-level positions at transparent prices — no calls, no emails.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <MovingBorder
              as={Link}
              href="/sign-up?role=PRODUCT_OWNER"
              containerClassName="rounded-full"
              borderRadius="2rem"
              className="px-8 py-3 text-sm font-semibold text-white"
              duration={3000}
            >
              Book a shelf →
            </MovingBorder>
            <Link
              href="/sign-up?role=SUPERMARKET"
              className="px-8 py-3 text-sm font-semibold text-gray-300 rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-all backdrop-blur-sm text-center"
            >
              List your shelves
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-14 flex gap-10 justify-center lg:justify-start"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-white">
                  <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: rotating logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
          className="flex-shrink-0 relative"
        >
          <div className="absolute inset-0 rounded-full bg-brand-green/20 blur-3xl scale-110" />
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo.svg"
              alt="Shelf platform"
              width={340}
              height={340}
              className="relative drop-shadow-2xl"
              priority
            />
          </motion.div>
          {/* Orbiting ping */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-4 left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-brand-green shadow-lg shadow-brand-green/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent"
        />
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
