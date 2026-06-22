"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let nt = 0;

    const speedVal = speed === "fast" ? 0.002 : 0.001;

    function getGradient(i: number) {
      const color = colors[i % colors.length];
      const next = colors[(i + 1) % colors.length];
      const grad = ctx!.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, color);
      grad.addColorStop(1, next);
      return grad;
    }

    function drawWave(n: number) {
      nt += speedVal;
      for (let i = 0; i < n; i++) {
        ctx!.beginPath();
        ctx!.lineWidth = waveWidth;
        ctx!.strokeStyle = getGradient(i);
        for (let x = 0; x < w; x += 5) {
          const y =
            (Math.sin(x / 800 + nt) +
              Math.sin(x / 600 + nt * 1.1 + i) +
              Math.sin(x / 400 + nt * 0.9 + i * 2)) *
              60 +
            h * 0.5;
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        ctx!.stroke();
        ctx!.closePath();
      }
    }

    function render() {
      ctx!.fillStyle = backgroundFill;
      ctx!.globalAlpha = 1;
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalAlpha = waveOpacity;
      drawWave(5);
      animRef.current = requestAnimationFrame(render);
    }

    render();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [colors, waveWidth, backgroundFill, blur, speed, waveOpacity]);

  return (
    <div className={cn("relative flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ filter: `blur(${blur}px)` }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
