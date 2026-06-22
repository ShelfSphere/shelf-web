"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  duration?: number;
  filter?: boolean;
}

export function TextGenerateEffect({
  words,
  className,
  duration = 0.5,
  filter = true,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        { opacity: 1, filter: filter ? "blur(0px)" : "none" },
        { duration, delay: (i: number) => i * 0.08 }
      );
    }
  }, [isInView, animate, duration, filter]);

  return (
    <div ref={scope} className={cn("font-bold", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="opacity-0 inline-block mr-[0.25em]"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
