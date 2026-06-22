"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowingStarsBackground({ className }: { className?: string }) {
  const [glowingStars, setGlowingStars] = useState<number[]>([]);
  const starsRef = useRef<HTMLDivElement>(null);
  const stars = 200;

  useEffect(() => {
    const interval = setInterval(() => {
      const randomStars = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars(randomStars);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={starsRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.sqrt(stars)}, 1fr)`,
      }}
    >
      {Array.from({ length: stars }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center">
          <div
            className={cn(
              "w-[1px] h-[1px] rounded-full bg-white/20",
              glowingStars.includes(i) && "bg-brand-green"
            )}
          />
          <AnimatePresence>
            {glowingStars.includes(i) && (
              <motion.div
                key={`glow-${i}`}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 12 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute w-[1px] h-[1px] rounded-full bg-brand-green/30 blur-sm"
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
