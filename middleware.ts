import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except api routes, static files, and Next.js internals
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
