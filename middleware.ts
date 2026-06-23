import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOCALES = ["en", "ru", "hy"] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Role-based route protection ──────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const role = token.role as string | undefined;

    if (pathname.startsWith("/dashboard/supermarket") && role !== "SUPERMARKET") {
      return NextResponse.redirect(new URL("/dashboard/product-owner", request.url));
    }

    if (pathname.startsWith("/dashboard/product-owner") && role !== "PRODUCT_OWNER") {
      return NextResponse.redirect(new URL("/dashboard/supermarket", request.url));
    }
  }

  // ── Language cookie sync ─────────────────────────────────────────────
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
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
