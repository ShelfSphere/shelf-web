import Link from "next/link";
import Image from "next/image";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { Meteors } from "@/components/ui/meteors";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden pt-20">
      {/* Spotlight effects */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <Spotlight className="top-10 left-full" fill="#2ECC71" />
      <Spotlight className="top-28 left-80" fill="#2980B9" />

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Meteors */}
      <div className="absolute inset-0 overflow-hidden">
        <Meteors number={12} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 py-20">
        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse inline-block" />
            Shelf marketplace — now live
          </div>

          <TextGenerateEffect
            words="Put your products on the right shelf"
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight"
            duration={0.6}
          />

          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Supermarkets list their shelf space in 3D. Brands discover and book
            premium eye-level positions at transparent prices — no calls, no emails.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-10 justify-center lg:justify-start">
            {[
              { value: "500+", label: "Supermarkets" },
              { value: "12k+", label: "Shelf listings" },
              { value: "2k+", label: "Brands" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: logo visual */}
        <div className="flex-shrink-0 relative">
          {/* Glow behind logo */}
          <div className="absolute inset-0 rounded-full bg-brand-green/20 blur-3xl scale-110" />
          <Image
            src="/logo.png"
            alt="Shelf platform"
            width={340}
            height={340}
            className="relative drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
