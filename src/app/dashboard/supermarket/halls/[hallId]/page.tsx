"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Hall, Shelf, ShelfTier } from "@/types";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, Eye, AlignCenter, ArrowUp, ArrowDown, Loader2, Layers, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

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
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
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
    setSheetOpen(false);
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
      <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
    </div>
  );
  if (!hall) return <div className="text-center py-20 text-muted-foreground">Hall not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mx-8 -mt-10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-background border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/supermarket/halls"><ArrowLeft size={16} /></Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="font-bold text-sm leading-tight">{hall.name}</h1>
            <p className="text-xs text-muted-foreground">{hall.width}m × {hall.depth}m × {hall.height}m</p>
          </div>
          <Badge variant="secondary">{hall.shelves.length} shelf{hall.shelves.length !== 1 ? "ves" : ""}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />Booked</span>
          </div>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {placementMode ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2">
              <Badge className="bg-brand-navy text-white gap-1.5 py-1.5 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                Click floor to place
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPlacementMode(false)}>
                <X size={14} />
              </Button>
            </motion.div>
          ) : (
            <Button onClick={() => setSheetOpen(true)} size="sm" className="bg-brand-navy hover:bg-brand-navy/90 shadow-sm">
              <Plus size={14} className="mr-1.5" /> Add shelf
            </Button>
          )}
        </div>
      </div>

      {/* 3D editor */}
      <div className="flex-1 relative overflow-hidden bg-[#0b1120]">
        <HallEditor3D
          hall={hall}
          onShelfToggle={handleShelfToggle}
          onShelfDelete={handleShelfDelete}
          onFloorClick={placementMode ? handleFloorClick : undefined}
          placementMode={placementMode}
        />
        {saving && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <Card className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-brand-navy" />
                <span className="text-sm font-semibold">Placing shelf…</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Shelf Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-96 flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Add a shelf</SheetTitle>
            <SheetDescription>Choose a tier, configure it, then click to place in the hall.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Tier picker */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Shelf tier</Label>
              <div className="space-y-2 mt-2">
                {TIERS.map(({ value, label, icon: Icon, color, bg, desc }) => (
                  <button
                    key={value}
                    onClick={() => selectTier(value)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      selectedTier === value ? `${bg} shadow-sm` : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedTier === value ? "bg-white/70" : "bg-muted"}`}>
                      <Icon size={17} className={selectedTier === value ? color : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${selectedTier === value ? color : "text-foreground"}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {selectedTier === value && <ChevronRight size={14} className={color} />}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedTier && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-4">
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="shelf-name">Shelf name</Label>
                    <Input
                      id="shelf-name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Shelf A1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shelf-price">Price per day ($)</Label>
                    <Input
                      id="shelf-price"
                      type="number"
                      value={form.pricePerDay}
                      onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {(["width", "height", "depth"] as const).map(field => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`shelf-${field}`} className="capitalize">{field} (m)</Label>
                        <Input
                          id={`shelf-${field}`}
                          type="number"
                          step="0.1"
                          value={form[field]}
                          onChange={e => setForm(f => ({ ...f, [field]: Number(e.target.value) }))}
                        />
                      </div>
                    ))}
                  </div>

                  <Card className="bg-muted/40">
                    <CardContent className="pt-4 pb-4 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers size={13} className="text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</span>
                      </div>
                      {[
                        { label: "Tier", value: TIERS.find(t => t.value === selectedTier)?.label },
                        { label: "Size", value: `${form.width}×${form.height}×${form.depth}m` },
                        { label: "Price", value: `$${form.pricePerDay}/day` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-col gap-2">
            <Button
              disabled={!selectedTier || !form.name}
              onClick={startPlacement}
              className="w-full bg-brand-navy hover:bg-brand-navy/90 shadow-sm"
            >
              <Plus size={15} className="mr-1.5" /> Place in hall
            </Button>
            <p className="text-center text-xs text-muted-foreground">Click on the floor to position the shelf</p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
