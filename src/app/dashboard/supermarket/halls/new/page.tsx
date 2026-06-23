"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, MoveHorizontal, MoveVertical, Layers, Lightbulb, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  width: z.coerce.number().positive("Must be positive"),
  depth: z.coerce.number().positive("Must be positive"),
  height: z.coerce.number().positive("Must be positive"),
});
type FormData = z.infer<typeof schema>;

const DIMENSION_FIELDS = [
  { key: "width"  as const, label: "Width",  unit: "m", icon: MoveHorizontal },
  { key: "depth"  as const, label: "Depth",  unit: "m", icon: ArrowRight },
  { key: "height" as const, label: "Height", unit: "m", icon: MoveVertical },
];

function HallPreview({ w, d, h }: { w: number; d: number; h: number }) {
  // Scale so the box fits nicely in a ~200×160 canvas
  const maxDim = Math.max(w, d, h, 1);
  const scale = 120 / maxDim;
  const fw = Math.max(w * scale, 20);
  const fd = Math.max(d * scale * 0.5, 14);   // depth projected
  const fh = Math.max(h * scale, 16);

  return (
    <svg viewBox="0 0 260 200" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="frontGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {(() => {
        const ox = 130 - fw / 2;
        const oy = 160;
        // front bottom-left origin
        const x0 = ox, y0 = oy;

        // Front face corners
        const frontTL = { x: x0,      y: y0 - fh };
        const frontTR = { x: x0 + fw, y: y0 - fh };
        const frontBR = { x: x0 + fw, y: y0 };
        const frontBL = { x: x0,      y: y0 };

        // Top face (offset by depth projection)
        const topTL = { x: frontTL.x + fd, y: frontTL.y - fd };
        const topTR = { x: frontTR.x + fd, y: frontTR.y - fd };

        // Right face bottom
        const rightBR = { x: frontBR.x + fd, y: frontBR.y - fd };

        return (
          <>
            {/* Front face */}
            <polygon
              points={`${frontTL.x},${frontTL.y} ${frontTR.x},${frontTR.y} ${frontBR.x},${frontBR.y} ${frontBL.x},${frontBL.y}`}
              fill="url(#frontGrad)" stroke="#1e3a5f" strokeWidth="1.5" strokeOpacity="0.3"
            />
            {/* Top face */}
            <polygon
              points={`${topTL.x},${topTL.y} ${topTR.x},${topTR.y} ${frontTR.x},${frontTR.y} ${frontTL.x},${frontTL.y}`}
              fill="url(#topGrad)" stroke="#1e3a5f" strokeWidth="1.5" strokeOpacity="0.3"
            />
            {/* Right face */}
            <polygon
              points={`${frontTR.x},${frontTR.y} ${topTR.x},${topTR.y} ${rightBR.x},${rightBR.y} ${frontBR.x},${frontBR.y}`}
              fill="url(#rightGrad)" stroke="#1e3a5f" strokeWidth="1.5" strokeOpacity="0.3"
            />

            {/* Width label */}
            <line x1={frontBL.x} y1={frontBL.y + 14} x2={frontBR.x} y2={frontBR.y + 14} stroke="#94a3b8" strokeWidth="1" />
            <line x1={frontBL.x} y1={frontBL.y + 10} x2={frontBL.x} y2={frontBL.y + 18} stroke="#94a3b8" strokeWidth="1" />
            <line x1={frontBR.x} y1={frontBR.y + 10} x2={frontBR.x} y2={frontBR.y + 18} stroke="#94a3b8" strokeWidth="1" />
            <text x={(frontBL.x + frontBR.x) / 2} y={frontBL.y + 26} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">{w}m</text>

            {/* Depth label */}
            <line x1={frontBR.x + 10} y1={frontBR.y} x2={rightBR.x + 10} y2={rightBR.y} stroke="#94a3b8" strokeWidth="1" />
            <text x={rightBR.x + 16} y={rightBR.y + 4} fontSize="11" fill="#64748b" fontWeight="500">{d}m</text>

            {/* Height label */}
            <line x1={frontBL.x - 12} y1={frontBL.y} x2={frontTL.x - 12} y2={frontTL.y} stroke="#94a3b8" strokeWidth="1" />
            <line x1={frontBL.x - 16} y1={frontBL.y} x2={frontBL.x - 8} y2={frontBL.y} stroke="#94a3b8" strokeWidth="1" />
            <line x1={frontTL.x - 16} y1={frontTL.y} x2={frontTL.x - 8} y2={frontTL.y} stroke="#94a3b8" strokeWidth="1" />
            <text x={frontBL.x - 18} y={(frontBL.y + frontTL.y) / 2 + 4} textAnchor="end" fontSize="11" fill="#64748b" fontWeight="500">{h}m</text>

            {/* Floor grid lines on front face */}
            {[0.33, 0.66].map((t) => (
              <line
                key={t}
                x1={frontBL.x + fw * t} y1={frontBL.y}
                x2={frontTL.x + fw * t} y2={frontTL.y}
                stroke="#1e3a5f" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3,3"
              />
            ))}
          </>
        );
      })()}
    </svg>
  );
}

export default function NewHallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { width: 20, depth: 30, height: 4 },
  });

  const w = Number(watch("width")) || 0;
  const d = Number(watch("depth")) || 0;
  const h = Number(watch("height")) || 0;
  const volume = (w * d * h).toLocaleString();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let supermarketId: string;
      try {
        const res = await api.get<{ id?: string; _id?: string }>("/supermarkets/mine");
        supermarketId = res.data.id ?? res.data._id!;
      } catch {
        const res = await api.post<{ id?: string; _id?: string }>("/supermarkets", {
          name: "My Supermarket",
          address: "To be updated",
        });
        supermarketId = res.data.id ?? res.data._id!;
      }
      const hallRes = await api.post<{ id: string }>("/halls", { ...data, supermarketId });
      toast.success("Hall created!");
      router.push(`/dashboard/supermarket/halls/${hallRes.data.id}`);
    } catch {
      toast.error("Failed to create hall");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2">New Hall</p>
        <h1 className="text-3xl font-bold text-gray-900">Set up your hall</h1>
        <p className="text-gray-400 text-sm mt-1">
          Define the 3D dimensions. You'll place shelves inside the editor after creation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-7 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hall-name">Hall name</Label>
                <Input
                  id="hall-name"
                  {...register("name")}
                  placeholder="e.g. Main Hall, North Wing…"
                />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Dimensions</Label>
                <div className="grid grid-cols-3 gap-4">
                  {DIMENSION_FIELDS.map(({ key, label, unit, icon: Icon }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`dim-${key}`} className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                        <Icon size={12} /> {label}
                      </Label>
                      <div className="relative">
                        <Input
                          id={`dim-${key}`}
                          type="number"
                          step="0.5"
                          {...register(key)}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unit}</span>
                      </div>
                      {errors[key] && <p className="text-destructive text-xs">{errors[key]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="pt-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={13} className="text-amber-500" />
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Tips</p>
                  </div>
                  <ul className="space-y-1 text-xs text-amber-700 leading-relaxed">
                    <li>• Standard halls are 20–50m wide and 3–5m tall.</li>
                    <li>• Shelf placement and pricing are set in the 3D editor.</li>
                  </ul>
                </CardContent>
              </Card>

              <Button type="submit" disabled={loading} className="w-full bg-brand-navy hover:bg-brand-navy/90 shadow-sm">
                {loading ? <><Loader2 size={15} className="animate-spin mr-2" />Creating…</> : <><Layers size={15} className="mr-2" />Create hall &amp; open editor</>}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Preview panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Preview</p>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full font-medium">
              {w} × {d} × {h} m
            </span>
          </div>

          {/* 3D box */}
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <motion.div
              className="w-full max-w-[320px]"
              key={`${w}-${d}-${h}`}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <HallPreview w={w} d={d} h={h} />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4">
            {[
              { label: "Width",  value: `${w}m` },
              { label: "Depth",  value: `${d}m` },
              { label: "Height", value: `${h}m` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-brand-navy/5 border border-brand-navy/10 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total volume</span>
            <span className="text-sm font-bold text-brand-navy">{volume} m³</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
