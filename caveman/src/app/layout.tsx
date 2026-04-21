import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`} style={{ background: "#0a0a0f" }}>
      <body className="min-h-full">
        <Navbar />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
