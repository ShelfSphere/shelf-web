import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ru", "hy"] as const;

export default withAuth(
  function middleware(request: NextRequest & { nextauth: { token: { role?: string } | null } }) {
    const { pathname } = request.nextUrl;
    const role = request.nextauth.token?.role;

    // Role-based route protection
    if (pathname.startsWith("/dashboard/supermarket") && role !== "SUPERMARKET") {
      return NextResponse.redirect(new URL("/dashboard/product-owner", request.url));
    }
    if (pathname.startsWith("/dashboard/product-owner") && role !== "PRODUCT_OWNER") {
      return NextResponse.redirect(new URL("/dashboard/supermarket", request.url));
    }

    // Language cookie sync
    const lang = request.nextUrl.searchParams.get("lang");
    if (lang && (LOCALES as readonly string[]).includes(lang)) {
      const response = NextResponse.next();
      response.cookies.set("lang", lang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth for dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
