"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  description: string;
  link?: string;
  icon?: React.ReactNode;
}

interface HoverEffectProps {
  items: Item[];
  className?: string;
}

export function HoverEffect({ items, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-brand-green/10 block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full flex flex-col gap-3 group-hover:border-brand-green/30 transition-colors duration-300">
            {item.icon && (
              <div className="text-4xl">{item.icon}</div>
            )}
            <h3 className="font-semibold text-white text-lg">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
