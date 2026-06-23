"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Store, Package, CalendarDays, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isSupermarket = session?.user?.role === "SUPERMARKET";

  const links = isSupermarket
    ? [
        { href: "/dashboard/supermarket", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/supermarket/halls", label: "My Halls", icon: Store },
        { href: "/dashboard/supermarket/bookings", label: "Bookings", icon: CalendarDays },
      ]
    : [
        { href: "/dashboard/product-owner", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/product-owner/browse", label: "Browse Shelves", icon: Package },
        { href: "/dashboard/product-owner/bookings", label: "My Bookings", icon: CalendarDays },
      ];

  const initials = session?.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f1729] flex flex-col z-30 border-r border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-green/30 rounded-xl blur-md group-hover:blur-lg transition-all" />
            <Image src="/logo.svg" alt="Shelf" width={36} height={36} className="relative" />
          </div>
          <span className="font-bold text-xl text-white">Shelf</span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className={cn("w-2 h-2 rounded-full", isSupermarket ? "bg-brand-orange" : "bg-brand-green")} />
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
            {isSupermarket ? "Supermarket" : "Brand / Product Owner"}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard/product-owner" && href !== "/dashboard/supermarket" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative group",
                  active
                    ? "bg-brand-green/15 text-brand-green border border-brand-green/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-green/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={17} className="flex-shrink-0 relative z-10" />
                <span className="relative z-10">{label}</span>
                {active && <ChevronRight size={14} className="ml-auto relative z-10 text-brand-green" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
            <p className="text-xs text-white/40 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
