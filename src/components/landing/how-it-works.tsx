const STEPS = [
  {
    icon: "🏪",
    title: "Supermarkets map their halls",
    description:
      "Use our 3D hall editor to recreate your store layout. Define shelves by dimensions, tier, and daily price.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    icon: "🟢",
    title: "Available shelves go live",
    description:
      "Green-highlighted shelves signal availability in real time. Shoppers and brands can browse by tier and location.",
    color: "bg-green-50 border-green-200",
  },
  {
    icon: "📦",
    title: "Brands discover & book",
    description:
      "Product owners filter by tier, price, and supermarket, then book dates directly — no back-and-forth emails.",
    color: "bg-orange-50 border-orange-200",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">How it works</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            From empty shelf to sold-out product in three steps.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`rounded-2xl border p-8 ${step.color} flex flex-col gap-4`}
            >
              <div className="text-4xl">{step.icon}</div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-brand-navy text-lg">{step.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
