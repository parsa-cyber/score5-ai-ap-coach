import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Score5 AI AP Coach",
  description: "AI AP study coach with diagnostics, FRQ grading, screenshot help, cram plans, referrals, and mistake review.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Score5",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
