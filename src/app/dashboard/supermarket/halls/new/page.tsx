"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, Loader2, MoveHorizontal, MoveVertical, Layers, Lightbulb } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  width: z.coerce.number().positive("Must be positive"),
  depth: z.coerce.number().positive("Must be positive"),
  height: z.coerce.number().positive("Must be positive"),
});
type FormData = z.infer<typeof schema>;

const DIMENSION_FIELDS = [
  { key: "width" as const,  label: "Width",  unit: "m", icon: MoveHorizontal, hint: "Side to side" },
  { key: "depth" as const,  label: "Depth",  unit: "m", icon: ArrowRight,     hint: "Front to back" },
  { key: "height" as const, label: "Height", unit: "m", icon: MoveVertical,   hint: "Floor to ceiling" },
];

export default function NewHallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { width: 20, depth: 30, height: 4 },
  });

  const [w, d, h] = [watch("width"), watch("depth"), watch("height")];
  const volume = (Number(w) * Number(d) * Number(h)).toLocaleString();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let supermarketId: string;
      try {
        const res = await api.get<{ id: string }>("/supermarkets/mine");
        supermarketId = res.data.id;
      } catch {
        const res = await api.post<{ id: string }>("/supermarkets", {
          name: "My Supermarket",
          address: "To be updated",
        });
        supermarketId = res.data.id;
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
      className="max-w-2xl space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2">New Hall</p>
        <h1 className="text-3xl font-bold text-gray-900">Set up your hall</h1>
        <p className="text-gray-400 text-sm mt-1">
          Define the 3D dimensions. You'll place shelves inside the editor after creation.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hall name</label>
            <input
              {...register("name")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
              placeholder="e.g. Main Hall, North Wing…"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Dimensions</label>
            <div className="grid grid-cols-3 gap-3">
              {DIMENSION_FIELDS.map(({ key, label, unit, icon: Icon }) => (
                <div key={key}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon size={12} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">{label}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      {...register(key)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>
                  </div>
                  {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-navy text-white font-semibold rounded-xl hover:bg-brand-navy/90 transition-colors disabled:opacity-60 shadow-lg shadow-brand-navy/20"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating…</>
            ) : (
              <><Layers size={16} /> Create hall & open editor</>
            )}
          </button>
        </form>

        {/* Side panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Preview</p>
            <div className="flex items-end justify-center gap-1 h-28 mb-4">
              {/* Simple 3D box illustration using divs */}
              <div className="relative" style={{ width: 80, height: 60 }}>
                {/* Front face */}
                <div className="absolute bottom-0 left-0 w-16 h-12 bg-brand-navy/10 border-2 border-brand-navy/20 rounded-sm" />
                {/* Top face */}
                <div
                  className="absolute border-2 border-brand-navy/20 bg-brand-navy/5 rounded-sm"
                  style={{ width: 48, height: 16, bottom: 48, left: 8, transform: "skewX(-20deg)" }}
                />
                {/* Right face */}
                <div
                  className="absolute border-2 border-brand-navy/20 bg-brand-navy/15 rounded-sm"
                  style={{ width: 16, height: 48, bottom: 0, left: 64, transform: "skewY(-20deg)" }}
                />
                {/* Dimension labels */}
                <span className="absolute -bottom-5 left-2 text-[10px] text-gray-400 font-medium">{w || 0}m</span>
                <span className="absolute -bottom-5 left-14 text-[10px] text-gray-400 font-medium">{d || 0}m</span>
                <span className="absolute bottom-2 -left-7 text-[10px] text-gray-400 font-medium">{h || 0}m</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Total volume</span>
                <span className="font-semibold text-gray-700">{volume} m³</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Tips</p>
            </div>
            <ul className="space-y-2 text-xs text-amber-700 leading-relaxed">
              <li>• Standard supermarket halls are 20–50m wide and 3–5m tall.</li>
              <li>• You can add multiple halls per store.</li>
              <li>• Shelf placement and pricing are set in the 3D editor.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
