// Root layout — owns <html> and <body>. Locale-specific setup is in [locale]/layout.tsx.
// suppressHydrationWarning prevents mismatches when the lang attribute is set client-side.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
