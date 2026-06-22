"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function FloatingNavbar() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setVisible(currentY < lastScrollY || currentY < 100);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const dashboardHref =
    session?.user?.role === "SUPERMARKET" ? "/dashboard/supermarket" : "/dashboard/product-owner";

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-4 inset-x-0 z-50 mx-auto max-w-2xl px-4",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300",
              scrolled
                ? "bg-black/80 backdrop-blur-md border-white/10 shadow-2xl"
                : "bg-white/5 backdrop-blur-sm border-white/10"
            )}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Shelf" width={28} height={28} />
              <span className="font-bold text-white text-sm">Shelf</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {session ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="text-sm font-medium text-white px-3 py-1.5 rounded-full bg-brand-green hover:bg-brand-green-dark transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors hidden sm:block"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-sm font-semibold px-4 py-1.5 bg-brand-green text-white rounded-full hover:bg-brand-green-dark transition-colors"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
