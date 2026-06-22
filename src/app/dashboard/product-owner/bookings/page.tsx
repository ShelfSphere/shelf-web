"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

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

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-brand-navy">{b.shelf?.name}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(b.startDate), "MMM d, yyyy")} –{" "}
                  {format(new Date(b.endDate), "MMM d, yyyy")}
                </p>
                <p className="text-sm font-bold text-brand-navy">${b.totalPrice}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>
                  {b.status}
                </span>
                {b.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
