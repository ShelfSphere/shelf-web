import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to find your shelf?
        </h2>
        <p className="mt-4 text-gray-300 text-lg">
          Join supermarkets and product owners already using Shelf to grow their
          business.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up?role=PRODUCT_OWNER"
            className="px-7 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-colors"
          >
            I'm a brand →
          </Link>
          <Link
            href="/sign-up?role=SUPERMARKET"
            className="px-7 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-colors"
          >
            I'm a supermarket →
          </Link>
        </div>
      </div>
    </section>
  );
}
