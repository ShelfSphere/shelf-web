import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function CTASection() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <BackgroundBeams />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
          Get started for free
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Ready to find your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue">
            perfect shelf?
          </span>
        </h2>
        <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto">
          Join supermarkets and product owners already using Shelf to grow their
          business. Setup takes minutes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up?role=PRODUCT_OWNER"
            className="px-8 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green-dark transition-colors text-sm shadow-lg shadow-brand-green/25"
          >
            I&apos;m a brand →
          </Link>
          <Link
            href="/sign-up?role=SUPERMARKET"
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm"
          >
            I&apos;m a supermarket →
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
          <span>✓ Free to list</span>
          <span>✓ No setup fees</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </section>
  );
}
