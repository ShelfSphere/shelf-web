"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  width: z.coerce.number().positive("Must be positive"),
  depth: z.coerce.number().positive("Must be positive"),
  height: z.coerce.number().positive("Must be positive"),
});
type FormData = z.infer<typeof schema>;

export default function NewHallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { width: 20, depth: 30, height: 4 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // First ensure the supermarket profile exists
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

      const hallRes = await api.post<{ id: string }>("/halls", {
        ...data,
        supermarketId,
      });

      toast.success("Hall created!");
      router.push(`/dashboard/supermarket/halls/${hallRes.data.id}`);
    } catch {
      toast.error("Failed to create hall");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Create a new hall</h1>
        <p className="text-gray-500 text-sm mt-1">
          Define the 3D dimensions of your hall. You can add shelves in the editor.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hall name</label>
          <input
            {...register("name")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            placeholder="Main hall"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(["width", "depth", "height"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field} (m)
              </label>
              <input
                type="number"
                step="0.5"
                {...register(field)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-navy text-white font-semibold rounded-lg hover:bg-brand-navy-light transition-colors disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create hall & open editor"}
        </button>
      </form>
    </div>
  );
}
