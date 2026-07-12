'use client'

import { Bell, Calendar, LogOut, Sun, Moon, Search } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const roleColors: Record<string, string> = {
    FLEET_MANAGER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    SAFETY_OFFICER: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    FINANCIAL_ANALYST: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    DRIVER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  }
  const role = session?.user?.role ?? ''

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 shadow-sm gap-4">
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {greeting}, <span className="text-blue-600 dark:text-blue-400">{session?.user?.name?.split(' ')[0] ?? 'User'}</span> 👋
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Calendar className="h-3 w-3 text-gray-400" />
          <p className="text-xs text-gray-400">{dateStr}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-gray-100 dark:bg-slate-800 border-0 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role badge */}
        <span className={`hidden md:inline-flex text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleColors[role] ?? 'bg-gray-100 text-gray-600'}`}>
          {role.replace(/_/g, ' ').toLowerCase()}
        </span>

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            title="Toggle dark mode"
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4 text-yellow-400" />
              : <Moon className="h-4 w-4 text-gray-600" />}
          </button>
        )}

        {/* Notification */}
        <button className="relative h-9 w-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4 text-gray-600 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20">
          {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 h-9 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-medium transition-colors border border-red-100 dark:border-red-900/40"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
