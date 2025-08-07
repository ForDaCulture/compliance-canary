// /frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compliance Canary | Automated Security & Compliance",
  description: "Stop breaches before auditors find them. Continuous offensive testing and automated evidence generation for HIPAA, SOC 2, and ISO 27001.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Wrap the app in the provider */}
      </body>
    </html>
  );
}
