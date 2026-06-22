import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "ru", "hy"] as const;

export function middleware(request: NextRequest) {
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
