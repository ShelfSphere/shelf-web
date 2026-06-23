"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CalendarDays, TrendingUp, ArrowRight, Sparkles, Eye, BarChart3 } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

const TIERS = [
  { emoji: "👁️", name: "Eye-level", desc: "Premium visibility", color: "from-brand-green/20 to-emerald-400/10", badge: "Most booked" },
  { emoji: "↔️", name: "Middle", desc: "Balanced price / reach", color: "from-blue-500/20 to-cyan-400/10", badge: null },
  { emoji: "⬆️", name: "Top", desc: "Aspirational placement", color: "from-purple-500/20 to-violet-400/10", badge: null },
  { emoji: "⬇️", name: "Bottom", desc: "Budget-friendly", color: "from-orange-400/20 to-amber-300/10", badge: "Best value" },
];

export default function ProductOwnerDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero greeting */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1729] to-[#1a2a4a] p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(46,204,113,0.12),transparent)]" />
        <div className="absolute top-4 right-6 text-5xl opacity-20 select-none">🛒</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-xs text-brand-green font-semibold uppercase tracking-widest">Marketplace</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}! 👋</h1>
          <p className="text-white/50 text-sm max-w-md">
            Discover premium shelf positions, track your campaigns, and grow your brand visibility.
          </p>
          <Link
            href="/dashboard/product-owner/browse"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-full hover:bg-brand-green/90 transition-colors shadow-lg shadow-brand-green/25"
          >
            Browse shelves <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item}>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/product-owner/browse">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-4">
                <Search size={22} className="text-brand-green" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Browse Shelves</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Filter by tier, price, and location. Preview the 3D layout before booking.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-green opacity-0 group-hover:opacity-100 transition-opacity">
                Explore now <ArrowRight size={12} />
              </div>
            </motion.div>
          </Link>

          <Link href="/dashboard/product-owner/bookings">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                <CalendarDays size={22} className="text-brand-orange" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">My Bookings</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Track your active campaigns, upcoming placements, and booking history.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">
                View bookings <ArrowRight size={12} />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Shelf tier guide */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Shelf Tier Guide</h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <BarChart3 size={12} />
            <span>Sorted by visibility</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className={`relative overflow-hidden bg-gradient-to-br ${tier.color} rounded-2xl border border-white p-4`}
            >
              {tier.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-gray-600">
                  {tier.badge}
                </span>
              )}
              <div className="text-2xl mb-2">{tier.emoji}</div>
              <h3 className="font-bold text-gray-800 text-sm">{tier.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{tier.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip banner */}
      <motion.div variants={item} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={18} className="text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Pro tip: Eye-level shelves get 3× more engagement</p>
          <p className="text-xs text-gray-400 mt-0.5">Book early to secure premium positions at the best supermarkets.</p>
        </div>
        <Link href="/dashboard/product-owner/browse" className="ml-auto flex-shrink-0 text-xs font-semibold text-brand-green hover:underline flex items-center gap-1">
          Browse <ArrowRight size={11} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
