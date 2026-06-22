const TIERS = [
  {
    tier: "Bottom shelf",
    icon: "⬇️",
    description: "Floor level. Budget-friendly, great for large items.",
    from: "$2",
    color: "border-blue-200 bg-blue-50",
    badge: "",
  },
  {
    tier: "Middle shelf",
    icon: "↔️",
    description: "Mid-height. Balanced visibility and price.",
    from: "$5",
    color: "border-green-200 bg-green-50",
    badge: "",
  },
  {
    tier: "Eye-level",
    icon: "👁️",
    description: "Premium. Highest foot-traffic visibility — proven to drive sales.",
    from: "$12",
    color: "border-orange-200 bg-orange-50",
    badge: "Most popular",
  },
  {
    tier: "Top shelf",
    icon: "⬆️",
    description: "Above eye-level. Great for tall or aspirational products.",
    from: "$7",
    color: "border-purple-200 bg-purple-50",
    badge: "",
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
            Shelf pricing by tier
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Each supermarket sets its own daily rate. These are typical starting
            prices across our network.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className={`rounded-2xl border p-6 flex flex-col gap-3 relative ${t.color}`}
            >
              {t.badge && (
                <span className="absolute top-4 right-4 text-xs font-semibold bg-brand-orange text-white px-2 py-0.5 rounded-full">
                  {t.badge}
                </span>
              )}
              <div className="text-3xl">{t.icon}</div>
              <h3 className="font-bold text-brand-navy text-base">{t.tier}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{t.description}</p>
              <div className="text-2xl font-extrabold text-brand-navy">
                {t.from}
                <span className="text-sm font-normal text-gray-400"> / day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
