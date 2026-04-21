'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BarChart3 } from 'lucide-react'

const links = [
  { href: '/', label: 'Hábitos', icon: House },
  { href: '/stats', label: 'Estatísticas', icon: BarChart3 },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center border-b border-white/[0.06] backdrop-blur-md bg-[#0f0f17]/80">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span className="text-sm font-semibold text-white/50 tracking-wide select-none">
          Habit<span className="text-violet-400">.</span>
        </span>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'text-white/40 hover:text-white/75 hover:bg-white/[0.05]'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
