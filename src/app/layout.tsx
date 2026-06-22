import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelf — The Shelf Marketplace",
  description:
    "Connect supermarkets with product owners. List, discover, and book premium shelf space.",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
