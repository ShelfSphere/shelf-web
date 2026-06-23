"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Hall, Supermarket } from "@/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, MoveHorizontal, MoveVertical, ArrowRight, Building2, Layers } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

function HallMiniPreview({ w, d, h }: { w: number; d: number; h: number }) {
  const maxDim = Math.max(w, d, h, 1);
  const scale = 52 / maxDim;
  const fw = Math.max(w * scale, 10);
  const fd = Math.max(d * scale * 0.45, 7);
  const fh = Math.max(h * scale, 8);

  return (
    <svg viewBox="0 0 90 70" className="w-full h-full">
      <defs>
        <linearGradient id={`fg-${w}-${d}-${h}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {(() => {
        const ox = 45 - fw / 2;
        const oy = 58;
        const x0 = ox, y0 = oy;
        const ftl = { x: x0, y: y0 - fh };
        const ftr = { x: x0 + fw, y: y0 - fh };
        const fbr = { x: x0 + fw, y: y0 };
        const fbl = { x: x0, y: y0 };
        const ttl = { x: ftl.x + fd, y: ftl.y - fd };
        const ttr = { x: ftr.x + fd, y: ftr.y - fd };
        const rbr = { x: fbr.x + fd, y: fbr.y - fd };
        return (
          <>
            <polygon points={`${ftl.x},${ftl.y} ${ftr.x},${ftr.y} ${fbr.x},${fbr.y} ${fbl.x},${fbl.y}`}
              fill={`url(#fg-${w}-${d}-${h})`} stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.25" />
            <polygon points={`${ttl.x},${ttl.y} ${ttr.x},${ttr.y} ${ftr.x},${ftr.y} ${ftl.x},${ftl.y}`}
              fill="#1e3a5f" fillOpacity="0.06" stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.25" />
            <polygon points={`${ftr.x},${ftr.y} ${ttr.x},${ttr.y} ${rbr.x},${rbr.y} ${fbr.x},${fbr.y}`}
              fill="#1e3a5f" fillOpacity="0.16" stroke="#1e3a5f" strokeWidth="1" strokeOpacity="0.25" />
          </>
        );
      })()}
    </svg>
  );
}

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmHall, setConfirmHall] = useState<Hall | null>(null);

  const fetchHalls = () => {
    api.get<Supermarket>("/supermarkets/mine")
      .then((res) => setHalls(res.data.halls ?? []))
      .catch(() => toast.error("Failed to load halls"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHalls(); }, []);

  const handleDelete = async (hall: Hall) => {
    setDeletingId(hall.id);
    setConfirmHall(null);
    try {
      await api.delete(`/halls/${hall.id}`);
      toast.success(`"${hall.name}" deleted`);
      setHalls((prev) => prev.filter((h) => h.id !== hall.id));
    } catch {
      toast.error("Failed to delete hall");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-10 w-28 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-52 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Halls</h1>
          <p className="text-gray-400 text-sm mt-0.5">{halls.length} hall{halls.length !== 1 ? "s" : ""} configured</p>
        </div>
        <Link
          href="/dashboard/supermarket/halls/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-xl hover:bg-brand-navy/90 transition-colors shadow-lg shadow-brand-navy/20"
        >
          <Plus size={15} /> New hall
        </Link>
      </div>

      {halls.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-center mb-5">
            <Building2 size={36} className="text-brand-navy/30" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">No halls yet</h3>
          <p className="text-gray-400 text-sm max-w-xs mb-6">
            Create your first hall to start placing shelves and accepting bookings.
          </p>
          <Link
            href="/dashboard/supermarket/halls/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white font-semibold rounded-xl hover:bg-brand-orange/90 transition-colors shadow-lg shadow-brand-orange/20 text-sm"
          >
            <Plus size={15} /> Create your first hall
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {halls.map((hall) => (
              <motion.div
                key={hall.id}
                variants={item}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Mini 3D preview */}
                <div className="h-36 bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-8 py-4 border-b border-gray-100">
                  <HallMiniPreview w={hall.width} d={hall.depth} h={hall.height} />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-bold text-gray-900 truncate">{hall.name}</h2>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dashboard/supermarket/halls/${hall.id}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => setConfirmHall(hall)}
                        disabled={deletingId === hall.id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MoveHorizontal size={11} /> {hall.width}m
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <ArrowRight size={11} /> {hall.depth}m
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MoveVertical size={11} /> {hall.height}m
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Layers size={11} /> {hall.shelves?.length ?? 0} shelf{(hall.shelves?.length ?? 0) !== 1 ? "ves" : ""}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/supermarket/halls/${hall.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-brand-navy/5 hover:bg-brand-navy text-brand-navy hover:text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Open 3D editor
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      <ConfirmDialog
        open={!!confirmHall}
        title={`Delete "${confirmHall?.name}"?`}
        description="This will permanently remove the hall and all its shelves. This cannot be undone."
        confirmLabel="Delete hall"
        onConfirm={() => confirmHall && handleDelete(confirmHall)}
        onCancel={() => setConfirmHall(null)}
      />
    </div>
  );
}
