'use client'

import { Bell, Calendar, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const roleColors: Record<string, string> = {
    FLEET_MANAGER: 'bg-blue-100 text-blue-700',
    SAFETY_OFFICER: 'bg-green-100 text-green-700',
    FINANCIAL_ANALYST: 'bg-violet-100 text-violet-700',
    DRIVER: 'bg-orange-100 text-orange-700',
  }
  const role = session?.user?.role ?? ''
  const roleLabel = role.replace(/_/g, ' ')

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {greeting}, <span className="text-blue-600">{session?.user?.name?.split(' ')[0] ?? 'User'}</span> 👋
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Calendar className="h-3 w-3 text-gray-400" />
          <p className="text-xs text-gray-400">{dateStr}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleColors[role] ?? 'bg-gray-100 text-gray-600'}`}>
          {roleLabel.toLowerCase()}
        </span>

        {/* Notification */}
        <button className="relative h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20">
          {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>

        {/* Logout button — always visible */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors border border-red-100"
          title="Sign out and switch account"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
