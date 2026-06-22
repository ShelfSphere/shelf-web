import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <body style={{ margin: 0, background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <h1 style={{ fontSize: 80, fontWeight: 800, margin: 0, color: "#2ECC71" }}>404</h1>
          <p style={{ color: "#6b7280", fontSize: 18 }}>This page could not be found.</p>
          <Link href="/" style={{ marginTop: 8, color: "#2ECC71", textDecoration: "underline" }}>
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
