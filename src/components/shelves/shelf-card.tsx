import type { Shelf } from "@/types";

const TIER_LABELS: Record<string, string> = {
  BOTTOM: "⬇️ Bottom",
  MIDDLE: "↔️ Middle",
  EYE_LEVEL: "👁️ Eye-level",
  TOP: "⬆️ Top",
};

interface Props {
  shelf: Shelf;
  onBook?: () => void;
}

export function ShelfCard({ shelf, onBook }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Availability banner */}
      <div className={`h-2 ${shelf.isAvailable ? "bg-brand-green" : "bg-red-400"}`} />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-brand-navy">{shelf.name}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {TIER_LABELS[shelf.tier]}
          </span>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{shelf.width}m × {shelf.depth}m × {shelf.height}m</p>
          <p className="text-xl font-bold text-brand-navy">
            ${shelf.pricePerDay}
            <span className="text-sm font-normal text-gray-400"> / day</span>
          </p>
        </div>
        {onBook && shelf.isAvailable && (
          <button
            onClick={onBook}
            className="w-full py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            Book this shelf
          </button>
        )}
        {!shelf.isAvailable && (
          <p className="text-center text-sm text-red-400 font-medium">Currently booked</p>
        )}
      </div>
    </div>
  );
}
