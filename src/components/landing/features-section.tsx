const FEATURES = [
  {
    icon: "🗺️",
    title: "3D hall editor",
    description:
      "Drag-and-drop shelf placement inside an interactive 3D model of your store. Green = available.",
  },
  {
    icon: "💰",
    title: "Tier-based pricing",
    description:
      "Eye-level shelves command premium rates. Set price per day per shelf and let the market decide.",
  },
  {
    icon: "📅",
    title: "Date-based bookings",
    description:
      "Brands pick start and end dates. Conflicts are prevented automatically — no double bookings.",
  },
  {
    icon: "🔐",
    title: "Google & email auth",
    description:
      "Sign up in seconds with Google or classic email/password. Separate roles for supermarkets and brands.",
  },
  {
    icon: "📊",
    title: "Real-time availability",
    description:
      "Shelves update the moment a booking is confirmed. Always accurate, always up to date.",
  },
  {
    icon: "🧾",
    title: "Booking history",
    description:
      "Full audit trail for both sides — supermarkets see who booked what; brands track their campaigns.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
            Everything you need
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Built for both sides of the shelf marketplace.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-brand-navy text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
