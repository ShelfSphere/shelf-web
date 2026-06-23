"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarDays, DollarSign, Store } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  PENDING:   { label: "Pending",   classes: "bg-amber-50 text-amber-600 border border-amber-200",  dot: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed", classes: "bg-green-50 text-green-600 border border-green-200",  dot: "bg-green-400" },
  CANCELLED: { label: "Cancelled", classes: "bg-red-50 text-red-500 border border-red-200",        dot: "bg-red-400" },
};

export default function SupermarketBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Booking[]>("/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incoming Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">Shelf booking requests from product owners.</p>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Once brands book your shelves, their requests will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => {
            const status = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy/10 flex items-center justify-center flex-shrink-0">
                    <Store size={20} className="text-brand-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900">{b.shelf?.name ?? "Shelf"}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <CalendarDays size={12} />
                        {format(new Date(b.startDate), "MMM d")} – {format(new Date(b.endDate), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <DollarSign size={12} />
                        ${b.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
