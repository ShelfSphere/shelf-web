"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-brand-green/20"
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10%" }}
      animate={{ y: [0, -900], opacity: [0, 0.6, 0] }}
      transition={{ duration: 6 + Math.random() * 4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

export default function NotFound() {
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      x: Math.random() * 100,
      size: 4 + Math.random() * 12,
    }))
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center px-4">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(46,204,113,0.07),transparent)] pointer-events-none" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <FloatingParticle key={p.id} delay={p.delay} x={p.x} size={p.size} />
            ))}
          </div>

          {/* 404 number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <span
              className="text-[160px] sm:text-[220px] font-extrabold leading-none select-none"
              style={{
                background: "linear-gradient(135deg, #2ECC71 0%, #27AE60 40%, #1a6b3a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 60px rgba(46,204,113,0.3))",
              }}
            >
              404
            </span>
            {/* Glowing ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-brand-green/10 blur-3xl -z-10"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Page not found
            </h1>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              The shelf you&apos;re looking for has been moved, or never existed. Let&apos;s get you back.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-3 mt-10"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white font-semibold rounded-full hover:bg-brand-green-dark transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-green/25 text-sm"
            >
              <Home size={15} />
              Back to home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 font-medium rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <ArrowLeft size={15} />
              Go back
            </button>
          </motion.div>

          {/* Decorative bottom line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-green/40 to-transparent"
          />
    </div>
  );
}
