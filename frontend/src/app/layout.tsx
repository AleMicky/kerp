import type { Metadata } from "next";
import "./globals.css";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "KERP - Cliente Next.js",
  description: "Cliente moderno Next.js para ERP PXP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased dark", "font-sans", inter.variable, geistHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
