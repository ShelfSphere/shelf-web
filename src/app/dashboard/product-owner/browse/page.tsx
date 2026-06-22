"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Shelf, ShelfTier } from "@/types";
import { toast } from "sonner";
import { ShelfCard } from "@/components/shelves/shelf-card";
import { BookingModal } from "@/components/shelves/booking-modal";

const TIERS: ShelfTier[] = ["BOTTOM", "MIDDLE", "EYE_LEVEL", "TOP"];

export default function BrowsePage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<ShelfTier | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);

  const fetchShelves = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (tierFilter) params.tier = tierFilter;
      if (maxPrice) params.priceMax = maxPrice;
      const res = await api.get<Shelf[]>("/shelves/available", { params });
      setShelves(res.data);
    } catch {
      toast.error("Failed to load shelves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelves();
  }, [tierFilter, maxPrice]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Browse Available Shelves</h1>
        <p className="text-gray-500 text-sm mt-1">
          Green shelves are available to book.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as ShelfTier | "")}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        >
          <option value="">All tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>{t.replace("_", " ")}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Max price / day"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : shelves.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No available shelves match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelves.map((shelf) => (
            <ShelfCard key={shelf.id} shelf={shelf} onBook={() => setSelectedShelf(shelf)} />
          ))}
        </div>
      )}

      {selectedShelf && (
        <BookingModal
          shelf={selectedShelf}
          onClose={() => setSelectedShelf(null)}
          onBooked={() => {
            setSelectedShelf(null);
            fetchShelves();
          }}
        />
      )}
    </div>
  );
}
