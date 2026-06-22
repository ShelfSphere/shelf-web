import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="pt-28 pb-20 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy relative overflow-hidden">
      {/* background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-brand-green/20 text-brand-green rounded-full mb-4 uppercase tracking-wider">
              Shelf marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance">
              Put your products on{" "}
              <span className="text-brand-green">the right shelf</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
              Supermarkets list their shelf space in 3D. Brands discover and
              book premium positions — eye-level to bottom — at transparent
              prices.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/sign-up?role=PRODUCT_OWNER"
                className="px-6 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-colors text-center"
              >
                Book a shelf
              </Link>
              <Link
                href="/sign-up?role=SUPERMARKET"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-center"
              >
                List your shelves
              </Link>
            </div>
          </div>

          {/* Logo / visual */}
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Shelf platform"
              width={320}
              height={320}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0">
          {[
            { label: "Supermarkets", value: "500+" },
            { label: "Shelf listings", value: "12k+" },
            { label: "Brands onboard", value: "2k+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
