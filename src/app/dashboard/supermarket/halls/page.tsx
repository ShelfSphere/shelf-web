"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Hall, Supermarket } from "@/types";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { toast } from "sonner";

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Supermarket>("/supermarkets/mine")
      .then((res) => setHalls(res.data.halls ?? []))
      .catch(() => toast.error("Failed to load halls"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">My Halls</h1>
        <Link
          href="/dashboard/supermarket/halls/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition-colors"
        >
          <Plus size={16} /> New hall
        </Link>
      </div>

      {halls.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No halls yet</p>
          <p className="text-sm mb-6">Create your first hall to start listing shelves.</p>
          <Link href="/dashboard/supermarket/halls/new" className="px-5 py-2.5 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-dark transition-colors">
            Create a hall
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div key={hall.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <h2 className="font-semibold text-brand-navy">{hall.name}</h2>
              <p className="text-sm text-gray-500">
                {hall.width}m × {hall.depth}m × {hall.height}m
              </p>
              <p className="text-sm text-gray-500">
                {hall.shelves?.length ?? 0} shelves
              </p>
              <Link
                href={`/dashboard/supermarket/halls/${hall.id}`}
                className="flex items-center gap-1.5 text-sm text-brand-blue font-medium hover:underline"
              >
                <Eye size={14} /> Open 3D editor
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
