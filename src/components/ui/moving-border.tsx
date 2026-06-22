"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  as: Component = "button",
  ...rest
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  as?: any;
  [key: string]: any;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.() ?? 0;
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <Component
      className={cn("relative overflow-hidden p-[1px] bg-transparent", containerClassName)}
      style={{ borderRadius }}
      {...rest}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={borderRadius}
            ry={borderRadius}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{ position: "absolute", top: 0, left: 0, transform }}
          className="h-10 w-10 opacity-[0.8] bg-[radial-gradient(circle,#2ECC71_40%,transparent_60%)]"
        />
      </div>
      <div
        className={cn("relative bg-brand-navy antialiased", className)}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}
