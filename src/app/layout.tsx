import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import PetProjectBadge from "@/components/PetProjectBadge";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

// Применяет тему до гидрации, чтобы не мигать белым при тёмном выборе.
// Хранится в localStorage; по умолчанию — системная настройка.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f4f4f5"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#09090b"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} bg-canvas text-ink`}>
        <div className="flex flex-col h-full lg:h-screen container mx-auto">
          {children}
          <PetProjectBadge />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
