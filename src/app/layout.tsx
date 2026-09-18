import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import PetProjectBadge from "@/components/PetProjectBadge";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Weather App",
  description: "Created by Shamshyrak Zholdasbek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/cloud.png" />
      </head>
      <body className={`${inter.className} bg-canvas text-ink`}>
        <div className="flex flex-col h-full lg:h-screen container mx-auto">
          <Header />
          {children}
          <PetProjectBadge />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
