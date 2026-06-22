import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";
import enMessages from "../../messages/en.json";
import ruMessages from "../../messages/ru.json";
import hyMessages from "../../messages/hy.json";

const MESSAGES = { en: enMessages, ru: ruMessages, hy: hyMessages };
const LOCALES = ["en", "ru", "hy"] as const;
type Locale = (typeof LOCALES)[number];

export const metadata: Metadata = {
  title: "Shelf — The Shelf Marketplace",
  description:
    "Connect supermarkets with product owners. List, discover, and book premium shelf space.",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value ?? "en";
  const locale: Locale = (LOCALES as readonly string[]).includes(lang)
    ? (lang as Locale)
    : "en";

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
