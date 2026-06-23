"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarDays, Package, DollarSign, XCircle, Inbox } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  PENDING:   { label: "Pending",   classes: "bg-amber-50 text-amber-600 border border-amber-200",   dot: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed", classes: "bg-green-50 text-green-600 border border-green-200",   dot: "bg-green-400" },
  CANCELLED: { label: "Cancelled", classes: "bg-red-50 text-red-500 border border-red-200",         dot: "bg-red-400" },
};

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5"><Inbox size={36} className="text-gray-400" /></div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">No bookings yet</h3>
      <p className="text-gray-400 text-sm max-w-xs">
        Once you book a shelf, your campaigns will appear here. Start by browsing available shelves.
      </p>
    </motion.div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get<Booking[]>("/bookings/my");
      setBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">Track your shelf campaigns and placement history.</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {bookings.map((b, i) => {
              const status = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
                  className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-brand-green" />
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
                    {b.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <XCircle size={15} />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
