import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Acompanhe seus hábitos diários",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} dark h-full antialiased`}>
      <body className="bg-gray-950 text-gray-100 min-h-full">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
