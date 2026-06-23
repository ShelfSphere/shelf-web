"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Hall, Shelf, ShelfTier } from "@/types";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Eye, AlignCenter, ArrowUp, ArrowDown, Loader2, Layers, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const HallEditor3D = dynamic(() => import("@/components/3d/hall-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0f1729] rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading 3D editor…</p>
      </div>
    </div>
  ),
});

const TIERS: { value: ShelfTier; label: string; icon: React.ElementType; color: string; bg: string; desc: string }[] = [
  { value: "EYE_LEVEL", label: "Eye Level", icon: Eye,         color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", desc: "Most visible, highest price" },
  { value: "MIDDLE",    label: "Middle",    icon: AlignCenter, color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",       desc: "Balanced reach & price" },
  { value: "TOP",       label: "Top",       icon: ArrowUp,     color: "text-purple-600",  bg: "bg-purple-50 border-purple-200",   desc: "Aspirational placement" },
  { value: "BOTTOM",    label: "Bottom",    icon: ArrowDown,   color: "text-orange-500",  bg: "bg-orange-50 border-orange-200",   desc: "Budget friendly" },
];

const DEFAULT_DIMS: Record<ShelfTier, { w: number; h: number; d: number; price: number; y: number }> = {
  EYE_LEVEL: { w: 2, h: 0.4, d: 0.5, price: 50, y: 1.4 },
  MIDDLE:    { w: 2, h: 0.4, d: 0.5, price: 30, y: 0.9 },
  TOP:       { w: 2, h: 0.4, d: 0.5, price: 20, y: 1.9 },
  BOTTOM:    { w: 2, h: 0.4, d: 0.5, price: 15, y: 0.2 },
};

export default function HallEditorPage() {
  const { hallId } = useParams<{ hallId: string }>();
  const router = useRouter();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ShelfTier | null>(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", pricePerDay: 50, width: 2, height: 0.4, depth: 0.5 });

  useEffect(() => {
    api.get<Hall>(`/halls/${hallId}`)
      .then((res) => setHall(res.data))
      .catch(() => toast.error("Failed to load hall"))
      .finally(() => setLoading(false));
  }, [hallId]);

  const selectTier = (tier: ShelfTier) => {
    const d = DEFAULT_DIMS[tier];
    setSelectedTier(tier);
    setForm({ name: `${TIERS.find(t => t.value === tier)?.label} Shelf`, pricePerDay: d.price, width: d.w, height: d.h, depth: d.d });
  };

  const startPlacement = () => {
    setPanelOpen(false);
    setPlacementMode(true);
    toast.info("Click anywhere on the floor to place the shelf", { duration: 4000 });
  };

  const handleFloorClick = async (x: number, z: number) => {
    if (!placementMode || !selectedTier || !hall) return;
    setSaving(true);
    try {
      const dims = DEFAULT_DIMS[selectedTier];
      const res = await api.post<Shelf>("/shelves", {
        hallId: hall.id,
        name: form.name,
        tier: selectedTier,
        pricePerDay: form.pricePerDay,
        width: form.width,
        height: form.height,
        depth: form.depth,
        positionX: x,
        positionY: dims.y,
        positionZ: z,
        isAvailable: true,
      });
      setHall(prev => prev ? { ...prev, shelves: [...prev.shelves, res.data] } : prev);
      toast.success("Shelf placed!");
      setPlacementMode(false);
      setSelectedTier(null);
    } catch {
      toast.error("Failed to place shelf");
    } finally {
      setSaving(false);
    }
  };

  const handleShelfToggle = async (shelfId: string, isAvailable: boolean) => {
    try {
      await api.put(`/shelves/${shelfId}`, { isAvailable });
      setHall(prev => prev ? { ...prev, shelves: prev.shelves.map(s => s.id === shelfId ? { ...s, isAvailable } : s) } : prev);
    } catch {
      toast.error("Failed to update shelf");
    }
  };

  const handleShelfDelete = async (shelfId: string) => {
    try {
      await api.delete(`/shelves/${shelfId}`);
      setHall(prev => prev ? { ...prev, shelves: prev.shelves.filter(s => s.id !== shelfId) } : prev);
      toast.success("Shelf removed");
    } catch {
      toast.error("Failed to remove shelf");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!hall) return <div className="text-center py-20 text-gray-400">Hall not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] gap-0 -mx-8 -mt-10 px-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/supermarket/halls" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">{hall.name}</h1>
            <p className="text-xs text-gray-400">{hall.width}m × {hall.depth}m × {hall.height}m · {hall.shelves.length} shelf{hall.shelves.length !== 1 ? "ves" : ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 mr-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Booked</span>
          </div>

          {placementMode ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-brand-navy text-white text-xs font-semibold px-4 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Click floor to place shelf
              <button onClick={() => setPlacementMode(false)} className="ml-1 hover:text-white/70">
                <X size={13} />
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-semibold rounded-xl hover:bg-brand-navy/90 transition-colors shadow-lg shadow-brand-navy/20"
            >
              <Plus size={15} /> Add shelf
            </button>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 relative overflow-hidden bg-[#0b1120]">
        <HallEditor3D
          hall={hall}
          onShelfToggle={handleShelfToggle}
          onShelfDelete={handleShelfDelete}
          onFloorClick={placementMode ? handleFloorClick : undefined}
          placementMode={placementMode}
        />

        {saving && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl">
              <Loader2 size={18} className="animate-spin text-brand-navy" />
              <span className="text-sm font-semibold text-gray-700">Placing shelf…</span>
            </div>
          </div>
        )}
      </div>

      {/* Add Shelf slide-in panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setPanelOpen(false)} />
            <motion.div key="panel"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900">Add a shelf</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Choose a tier, configure it, then click to place</p>
                </div>
                <button onClick={() => setPanelOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tier picker */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shelf tier</p>
                  <div className="space-y-2">
                    {TIERS.map(({ value, label, icon: Icon, color, bg, desc }) => (
                      <button
                        key={value}
                        onClick={() => selectTier(value)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                          selectedTier === value ? bg + " border-current shadow-sm" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedTier === value ? "bg-white/70" : "bg-gray-100"}`}>
                          <Icon size={17} className={selectedTier === value ? color : "text-gray-400"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${selectedTier === value ? color : "text-gray-700"}`}>{label}</p>
                          <p className="text-xs text-gray-400 truncate">{desc}</p>
                        </div>
                        {selectedTier === value && <ChevronRight size={14} className={color} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Config form — only shown when tier is selected */}
                <AnimatePresence>
                  {selectedTier && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="space-y-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</p>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shelf name</label>
                        <input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                          placeholder="e.g. Shelf A1"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price per day ($)</label>
                        <input
                          type="number"
                          value={form.pricePerDay}
                          onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {(["width", "height", "depth"] as const).map(field => (
                          <div key={field}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 capitalize">{field} (m)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={form[field]}
                              onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))}
                              className="w-full border border-gray-200 rounded-xl px-2.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Summary card */}
                      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers size={13} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Summary</span>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between"><span>Tier</span><span className="font-semibold">{TIERS.find(t => t.value === selectedTier)?.label}</span></div>
                          <div className="flex justify-between"><span>Size</span><span className="font-semibold">{form.width}×{form.height}×{form.depth}m</span></div>
                          <div className="flex justify-between"><span>Price</span><span className="font-semibold text-brand-green">${form.pricePerDay}/day</span></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <button
                  disabled={!selectedTier || !form.name}
                  onClick={startPlacement}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-navy text-white font-semibold rounded-xl hover:bg-brand-navy/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-navy/20"
                >
                  <Plus size={16} /> Place in hall
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">You'll click on the floor to position the shelf</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
