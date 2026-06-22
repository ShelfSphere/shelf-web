"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Store, Package, CalendarDays, LogOut } from "lucide-react";

export function DashboardNav() {
  const { data: session } = useSession();
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

  return (
    <nav className="bg-brand-navy text-white h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-6">
      <Link href="/" className="flex items-center gap-2 mr-4">
        <Image src="/logo.png" alt="Shelf" width={28} height={28} />
        <span className="font-bold text-lg">Shelf</span>
      </Link>
      <div className="flex-1 flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/60 hidden sm:block">{session?.user?.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </nav>
  );
}
