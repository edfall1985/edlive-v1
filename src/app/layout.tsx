import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "edLive - Debate Command Center",
  description: "Ekosistem Pembelajaran Publik Berbasis Konflik Gagasan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
