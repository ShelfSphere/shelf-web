import { redirect } from "next/navigation";

// Fallback in case the next-intl middleware hasn't redirected yet.
export default function RootPage() {
  redirect("/en");
}
