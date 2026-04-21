"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2 } from "lucide-react";

const links = [
  { href: "/", label: "Hábitos", icon: Home },
  { href: "/stats", label: "Estatísticas", icon: BarChart2 },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-2xl border border-white/10"
        style={{
          background: "rgba(10, 10, 15, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-violet-600/80 text-white shadow-lg shadow-violet-900/30"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
