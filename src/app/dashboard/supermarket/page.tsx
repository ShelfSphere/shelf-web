"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store, Plus, CalendarDays, ArrowRight, Sparkles, TrendingUp, Layers, Building2 } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

export default function SupermarketDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero greeting */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1729] to-[#1a2a4a] p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(235,115,28,0.12),transparent)]" />
        <div className="absolute top-4 right-6 opacity-10 select-none"><Building2 size={72} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-brand-orange" />
            <span className="text-xs text-brand-orange font-semibold uppercase tracking-widest">Supermarket Portal</span>
          </div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}!</h1>
          <p className="text-white/50 text-sm max-w-md">
            Manage your hall layouts, list shelf space, and accept bookings from brands.
          </p>
          <Link
            href="/dashboard/supermarket/halls/new"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-brand-orange text-white text-sm font-semibold rounded-full hover:bg-brand-orange/90 transition-colors shadow-lg shadow-brand-orange/25"
          >
            <Plus size={14} /> Create new hall
          </Link>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item}>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Manage</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              href: "/dashboard/supermarket/halls",
              icon: Store,
              color: "bg-brand-navy/10",
              iconColor: "text-brand-navy",
              hoverGradient: "from-brand-navy/5",
              label: "My Halls",
              desc: "Create and edit your 3D hall layouts with shelves, dimensions, and pricing.",
              cta: "Manage halls",
              ctaColor: "text-brand-navy",
            },
            {
              href: "/dashboard/supermarket/halls/new",
              icon: Plus,
              color: "bg-brand-green/10",
              iconColor: "text-brand-green",
              hoverGradient: "from-brand-green/5",
              label: "New Hall",
              desc: "Set up a new hall with our 3D editor and start listing your shelf space today.",
              cta: "Get started",
              ctaColor: "text-brand-green",
            },
            {
              href: "/dashboard/supermarket/bookings",
              icon: CalendarDays,
              color: "bg-orange-50",
              iconColor: "text-brand-orange",
              hoverGradient: "from-brand-orange/5",
              label: "Bookings",
              desc: "Review and manage incoming shelf booking requests from product owners.",
              cta: "View bookings",
              ctaColor: "text-brand-orange",
            },
          ].map(({ href, icon: Icon, color, iconColor, hoverGradient, label, desc, cta, ctaColor }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-shadow cursor-pointer h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${ctaColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {cta} <ArrowRight size={12} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item}>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "01", icon: Layers, title: "Create a Hall", desc: "Design your 3D hall layout and add shelf positions with dimensions." },
            { step: "02", icon: Store, title: "List Shelves", desc: "Set pricing, tier, and availability for each shelf space." },
            { step: "03", icon: TrendingUp, title: "Accept Bookings", desc: "Brands discover your shelves and send booking requests for you to approve." },
          ].map(({ step, icon: Icon, title, desc }) => (
            <motion.div
              key={step}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-gray-300">{step}</span>
                <Icon size={16} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
