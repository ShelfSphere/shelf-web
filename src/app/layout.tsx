// Root layout required by Next.js. Full layout is in [locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}
