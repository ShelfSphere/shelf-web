"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { Shelf, ShelfTier } from "@/types";
import { toast } from "sonner";
import { ShelfCard } from "@/components/shelves/shelf-card";
import { BookingModal } from "@/components/shelves/booking-modal";
import { Search, SlidersHorizontal, X, Eye, AlignCenter, ArrowUp, ArrowDown, ShoppingBag, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS: { value: ShelfTier; label: string; icon: LucideIcon }[] = [
  { value: "EYE_LEVEL", label: "Eye Level", icon: Eye },
  { value: "MIDDLE",    label: "Middle",    icon: AlignCenter },
  { value: "TOP",       label: "Top",       icon: ArrowUp },
  { value: "BOTTOM",    label: "Bottom",    icon: ArrowDown },
];

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
        {hasFilters ? <Search size={36} className="text-gray-400" /> : <ShoppingBag size={36} className="text-gray-400" />}
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">
        {hasFilters ? "No shelves match your filters" : "No shelves available right now"}
      </h3>
      <p className="text-gray-400 text-sm max-w-xs">
        {hasFilters ? "Try adjusting your filters to see more results." : "Check back soon — new shelves are added regularly."}
      </p>
    </motion.div>
  );
}

export default function BrowsePage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<ShelfTier | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);

  const hasFilters = !!tierFilter || !!maxPrice;

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

  useEffect(() => { fetchShelves(); }, [tierFilter, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Shelves</h1>
        <p className="text-gray-400 text-sm mt-1">Find and book premium shelf space across supermarkets.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</span>
          {hasFilters && (
            <button
              onClick={() => { setTierFilter(""); setMaxPrice(""); }}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setTierFilter("")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              !tierFilter
                ? "bg-brand-navy text-white border-brand-navy"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            )}
          >
            All tiers
          </button>
          {TIERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTierFilter(tierFilter === t.value ? "" : t.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5",
                tierFilter === t.value
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              )}
            >
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
          <input
            type="number"
            placeholder="Max price / day"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-48">
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : shelves.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <p className="text-xs text-gray-400">{shelves.length} shelf{shelves.length !== 1 ? "ves" : ""} available</p>
          <AnimatePresence>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shelves.map((shelf, i) => (
                <motion.div
                  key={shelf.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
                >
                  <ShelfCard shelf={shelf} onBook={() => setSelectedShelf(shelf)} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </>
      )}

      {selectedShelf && (
        <BookingModal
          shelf={selectedShelf}
          onClose={() => setSelectedShelf(null)}
          onBooked={() => { setSelectedShelf(null); fetchShelves(); }}
        />
      )}
    </div>
  );
}
