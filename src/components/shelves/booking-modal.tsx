"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { Shelf } from "@/types";
import { toast } from "sonner";
import { differenceInCalendarDays, addDays, format } from "date-fns";
import { X } from "lucide-react";

interface Props {
  shelf: Shelf;
  onClose: () => void;
  onBooked: () => void;
}

export function BookingModal({ shelf, onClose, onBooked }: Props) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  const days = Math.max(1, differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1);
  const total = days * shelf.pricePerDay;

  const handleBook = async () => {
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bookings", {
        shelfId: shelf.id,
        startDate,
        endDate,
      });
      toast.success("Shelf booked successfully!");
      onBooked();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-navy">Book {shelf.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>Tier: {shelf.tier.replace("_", " ")}</p>
          <p>${shelf.pricePerDay} / day</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Duration</span>
            <span>{days} day{days !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between font-bold text-brand-navy">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Booking…" : `Confirm booking — $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
