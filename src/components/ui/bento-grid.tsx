"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoItem {
  title: string;
  description: string;
  icon: string;
  className?: string;
  highlight?: boolean;
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className={cn(
            "group relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 overflow-hidden cursor-default",
            "hover:border-brand-green/30 transition-colors duration-300",
            item.highlight && "bg-gradient-to-br from-brand-green/10 to-transparent border-brand-green/20",
            item.className
          )}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-green/5 to-transparent rounded-2xl" />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/3 to-transparent rounded-bl-full" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="text-3xl">{item.icon}</div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
