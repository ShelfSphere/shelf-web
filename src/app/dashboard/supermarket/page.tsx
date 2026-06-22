"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Store, Plus, CalendarDays } from "lucide-react";

export default function SupermarketDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">
          Welcome, {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your halls, shelves, and incoming bookings.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Link
          href="/dashboard/supermarket/halls"
          className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <Store className="text-brand-navy" size={28} />
          <h2 className="font-semibold text-brand-navy">My Halls</h2>
          <p className="text-sm text-gray-500">
            Create and edit your 3D hall layouts. Add shelves with dimensions and pricing.
          </p>
        </Link>

        <Link
          href="/dashboard/supermarket/halls/new"
          className="flex flex-col gap-3 p-6 bg-brand-green/10 rounded-2xl border border-brand-green/30 hover:shadow-md transition-shadow"
        >
          <Plus className="text-brand-green" size={28} />
          <h2 className="font-semibold text-brand-navy">New Hall</h2>
          <p className="text-sm text-gray-500">
            Set up a new hall with our 3D editor and start listing your shelf space.
          </p>
        </Link>

        <Link
          href="/dashboard/supermarket/bookings"
          className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <CalendarDays className="text-brand-orange" size={28} />
          <h2 className="font-semibold text-brand-navy">Bookings</h2>
          <p className="text-sm text-gray-500">
            View and manage incoming shelf booking requests from product owners.
          </p>
        </Link>
      </div>
    </div>
  );
}
