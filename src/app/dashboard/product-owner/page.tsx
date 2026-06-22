"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, CalendarDays, Search } from "lucide-react";

export default function ProductOwnerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">
          Welcome, {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Discover available shelf space and manage your bookings.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Link
          href="/dashboard/product-owner/browse"
          className="flex flex-col gap-3 p-6 bg-brand-green/10 rounded-2xl border border-brand-green/30 hover:shadow-md transition-shadow"
        >
          <Search className="text-brand-green" size={28} />
          <h2 className="font-semibold text-brand-navy">Browse Shelves</h2>
          <p className="text-sm text-gray-500">
            Filter by tier, price, and location. View the 3D layout before booking.
          </p>
        </Link>

        <Link
          href="/dashboard/product-owner/bookings"
          className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <CalendarDays className="text-brand-orange" size={28} />
          <h2 className="font-semibold text-brand-navy">My Bookings</h2>
          <p className="text-sm text-gray-500">
            Track your active campaigns and booking history.
          </p>
        </Link>

        <div className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-100">
          <Package className="text-brand-blue" size={28} />
          <h2 className="font-semibold text-brand-navy">Shelf tiers</h2>
          <div className="space-y-1 text-xs text-gray-500">
            <p>👁️ Eye-level — premium visibility</p>
            <p>↔️ Middle — balanced price/reach</p>
            <p>⬆️ Top — aspirational placement</p>
            <p>⬇️ Bottom — budget-friendly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
