import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda Barber",
  description: "Agende seu corte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* ADICIONADO: suppressHydrationWarning para ignorar extensões do Chrome */}
      <body 
        className={inter.className} 
        suppressHydrationWarning={true} 
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}