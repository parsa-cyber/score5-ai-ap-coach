import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Score5 | AI AP Study Coach",
  description: "AI AP study coach for every AP class with diagnostic practice, FRQ feedback, screenshot analysis, progress tracking, and AI tutoring.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
