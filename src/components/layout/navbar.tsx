"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "SUPERMARKET"
      ? "/dashboard/supermarket"
      : "/dashboard/product-owner";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Shelf" width={36} height={36} />
          <span className="text-xl font-bold text-brand-navy">Shelf</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
            How it works
          </Link>
          <Link href="#features" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href={dashboardHref}
                className="text-sm font-medium text-brand-navy hover:text-brand-green transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-navy transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-brand-navy transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-sm text-gray-700" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="#features" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#pricing" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Pricing</Link>
          {session ? (
            <>
              <Link href={dashboardHref} className="text-sm font-medium text-brand-green">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-left text-gray-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-brand-navy">Sign in</Link>
              <Link href="/sign-up" className="text-sm font-semibold px-4 py-2 bg-brand-navy text-white rounded-lg text-center">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
