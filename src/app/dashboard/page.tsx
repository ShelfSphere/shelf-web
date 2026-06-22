"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/sign-in");
    } else if (session.user.role === "SUPERMARKET") {
      router.replace("/dashboard/supermarket");
    } else {
      router.replace("/dashboard/product-owner");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
