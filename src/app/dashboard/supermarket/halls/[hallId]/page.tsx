"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Hall, Shelf } from "@/types";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, Loader2, X, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const HallEditor3D = dynamic(() => import("@/components/3d/hall-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#f0ede8] rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading 3D editor…</p>
      </div>
    </div>
  ),
});

const LEVEL_OPTIONS = [1, 2, 3, 4, 5, 6];

// Height of a stand based on levels: 0.45m per level + 0.05m base
const standHeight = (levels: number) => levels * 0.45 + 0.05;

// Mini SVG preview of a gondola stand
function StandPreview({ levels }: { levels: number }) {
  const h = 60;
  const w = 44;
  const uprightW = 5;
  const levelH = h / levels;
  const boardH = 3;

  return (
    <svg viewBox={`0 0 ${w} ${h + 4}`} className="w-full h-full">
      {/* Left upright */}
      <rect x={0} y={0} width={uprightW} height={h} rx={1} fill="#dc2626" />
      {/* Right upright */}
      <rect x={w - uprightW} y={0} width={uprightW} height={h} rx={1} fill="#dc2626" />
      {/* Back panel */}
      <rect x={uprightW} y={2} width={w - uprightW * 2} height={h - 4} fill="#f0e8d8" />
      {/* Shelf boards */}
      {Array.from({ length: levels + 1 }).map((_, i) => (
        <rect key={i} x={0} y={i * levelH - boardH / 2} width={w} height={boardH} rx={1} fill="#f5ede0" stroke="#e0d5c5" strokeWidth={0.5} />
      ))}
    </svg>
  );
}

export default function HallEditorPage() {
  const { hallId } = useParams<{ hallId: string }>();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState(4);
  const [placementMode, setPlacementMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "Stand A", pricePerDay: 40, width: 2, depth: 0.5 });

  useEffect(() => {
    api.get<Hall>(`/halls/${hallId}`)
      .then((res) => setHall(res.data))
      .catch(() => toast.error("Failed to load hall"))
      .finally(() => setLoading(false));
  }, [hallId]);

  const startPlacement = () => {
    setSheetOpen(false);
    setPlacementMode(true);
    toast.info("Click & drag on the floor to fill a row with stands", { duration: 5000 });
  };

  const handleLineDrop = async (positions: { x: number; z: number }[], rotation: number) => {
    if (!hall) return;
    setSaving(true);
    try {
      const h = standHeight(selectedLevels);
      const results = await Promise.all(
        positions.map(({ x, z }) =>
          api.post<Shelf>("/shelves", {
            hallId: hall.id,
            name: form.name,
            tier: "EYE_LEVEL",
            levels: selectedLevels,
            rotation,
            pricePerDay: form.pricePerDay,
            width: form.width,
            height: h,
            depth: form.depth,
            positionX: x,
            positionY: 0,
            positionZ: z,
            isAvailable: true,
          })
        )
      );
      setHall(prev => prev
        ? { ...prev, shelves: [...prev.shelves, ...results.map(r => r.data)] }
        : prev
      );
      const n = positions.length;
      toast.success(`${n} stand${n > 1 ? "s" : ""} placed!`);
      setPlacementMode(false);
    } catch {
      toast.error("Failed to place stands");
    } finally {
      setSaving(false);
    }
  };

  const handleShelfToggle = async (shelfId: string, isAvailable: boolean) => {
    try {
      await api.put(`/shelves/${shelfId}`, { isAvailable });
      setHall(prev => prev ? { ...prev, shelves: prev.shelves.map(s => s.id === shelfId ? { ...s, isAvailable } : s) } : prev);
    } catch {
      toast.error("Failed to update stand");
    }
  };

  const handleShelfDelete = async (shelfId: string) => {
    try {
      await api.delete(`/shelves/${shelfId}`);
      setHall(prev => prev ? { ...prev, shelves: prev.shelves.filter(s => s.id !== shelfId) } : prev);
      toast.success("Stand removed");
    } catch {
      toast.error("Failed to remove stand");
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
          <Badge variant="secondary">{hall.shelves.length} stand{hall.shelves.length !== 1 ? "s" : ""}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />Booked</span>
          </div>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {placementMode ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white gap-1.5 py-1.5 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Click floor to place
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPlacementMode(false)}>
                <X size={14} />
              </Button>
            </motion.div>
          ) : (
            <Button onClick={() => setSheetOpen(true)} size="sm" className="bg-brand-navy hover:bg-brand-navy/90 shadow-sm">
              <Plus size={14} className="mr-1.5" /> Add stand
            </Button>
          )}
        </div>
      </div>

      {/* 3D editor */}
      <div className="flex-1 relative overflow-hidden bg-[#f0ede8]">
        <HallEditor3D
          hall={hall}
          onShelfToggle={handleShelfToggle}
          onShelfDelete={handleShelfDelete}
          onLineDrop={placementMode ? handleLineDrop : undefined}
          placementMode={placementMode}
          ghostLevels={selectedLevels}
          ghostWidth={form.width}
          ghostDepth={form.depth}
        />

        {/* Empty state CTA */}
        {hall.shelves.length === 0 && !placementMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 shadow-lg text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-navy/8 border border-brand-navy/12 flex items-center justify-center">
                <Layers size={22} className="text-brand-navy/50" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">No stands yet</p>
                <p className="text-xs text-gray-400 mt-0.5">Place your first gondola stand in the hall</p>
              </div>
              <Button onClick={() => setSheetOpen(true)} size="sm" className="bg-brand-navy hover:bg-brand-navy/90 shadow-sm mt-1">
                <Plus size={14} className="mr-1.5" /> Add stand
              </Button>
            </motion.div>
          </div>
        )}
        {saving && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
            <Card className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-brand-navy" />
                <span className="text-sm font-semibold">Placing stand…</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Stand Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Add a stand</SheetTitle>
            <SheetDescription>Choose the number of shelf levels, configure details, then click to place.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Level picker */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Number of shelf levels</Label>
              <div className="grid grid-cols-6 gap-2">
                {LEVEL_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedLevels(n)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                      selectedLevels === n
                        ? "border-brand-navy bg-brand-navy/5"
                        : "border-border hover:border-gray-300"
                    }`}
                  >
                    <div className="w-10 h-12">
                      <StandPreview levels={n} />
                    </div>
                    <span className={`text-xs font-bold ${selectedLevels === n ? "text-brand-navy" : "text-muted-foreground"}`}>{n}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Stand height: <span className="font-semibold text-foreground">{standHeight(selectedLevels).toFixed(2)}m</span>
              </p>
            </div>

            <Separator />

            {/* Stand preview */}
            <div className="flex items-center gap-5 p-4 bg-muted/30 rounded-xl border">
              <div className="w-20 h-24 flex-shrink-0">
                <StandPreview levels={selectedLevels} />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">{selectedLevels}-level gondola stand</p>
                <p className="text-xs text-muted-foreground">{selectedLevels + 1} shelf boards</p>
                <p className="text-xs text-muted-foreground">Height: {standHeight(selectedLevels).toFixed(2)}m</p>
                <p className="text-xs text-muted-foreground">Width: {form.width}m · Depth: {form.depth}m</p>
              </div>
            </div>

            <Separator />

            {/* Form fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stand-name">Stand name</Label>
                <Input
                  id="stand-name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Stand A1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stand-price">Price per day ($)</Label>
                <Input
                  id="stand-price"
                  type="number"
                  value={form.pricePerDay}
                  onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="stand-width">Width (m)</Label>
                  <Input
                    id="stand-width"
                    type="number"
                    step="0.5"
                    value={form.width}
                    onChange={e => setForm(f => ({ ...f, width: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stand-depth">Depth (m)</Label>
                  <Input
                    id="stand-depth"
                    type="number"
                    step="0.1"
                    value={form.depth}
                    onChange={e => setForm(f => ({ ...f, depth: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Summary card */}
            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={13} className="text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</span>
                </div>
                {[
                  { label: "Levels", value: `${selectedLevels} (${selectedLevels + 1} boards)` },
                  { label: "Dimensions", value: `${form.width}×${standHeight(selectedLevels).toFixed(2)}×${form.depth}m` },
                  { label: "Price", value: `$${form.pricePerDay}/day` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-col gap-2">
            <Button
              disabled={!form.name}
              onClick={startPlacement}
              className="w-full bg-brand-navy hover:bg-brand-navy/90 shadow-sm"
            >
              <Plus size={15} className="mr-1.5" /> Place in hall
            </Button>
            <p className="text-center text-xs text-muted-foreground">Click on the floor to position the stand</p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
