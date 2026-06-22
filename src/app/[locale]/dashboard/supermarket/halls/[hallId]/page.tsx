"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Hall } from "@/types";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Three.js must be dynamically imported — no SSR
const HallEditor3D = dynamic(() => import("@/components/3d/hall-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-2xl">
      <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function HallEditorPage() {
  const { hallId } = useParams<{ hallId: string }>();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Hall>(`/halls/${hallId}`)
      .then((res) => setHall(res.data))
      .catch(() => toast.error("Failed to load hall"))
      .finally(() => setLoading(false));
  }, [hallId]);

  const handleShelfUpdate = async (shelfId: string, isAvailable: boolean) => {
    try {
      await api.put(`/shelves/${shelfId}`, { isAvailable });
      setHall((prev) =>
        prev
          ? {
              ...prev,
              shelves: prev.shelves.map((s) =>
                s.id === shelfId ? { ...s, isAvailable } : s
              ),
            }
          : prev
      );
    } catch {
      toast.error("Failed to update shelf");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" /></div>;
  if (!hall) return <div className="text-center py-20 text-gray-400">Hall not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">{hall.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {hall.width}m × {hall.depth}m × {hall.height}m — {hall.shelves.length} shelves
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-brand-green inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />
          Booked
        </span>
      </div>

      <HallEditor3D hall={hall} onShelfToggle={handleShelfUpdate} />
    </div>
  );
}
