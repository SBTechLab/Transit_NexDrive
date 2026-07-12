'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Truck, Users, Map, Wrench, Fuel, PieChart, LogOut, Zap } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Role } from '@prisma/client'

const routes = [
  { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard, roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER] },
  { href: '/vehicles',      label: 'Vehicles',      icon: Truck,           roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER] },
  { href: '/drivers',       label: 'Drivers',       icon: Users,           roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.DRIVER] },
  { href: '/trips',         label: 'Trips',         icon: Map,             roles: [Role.FLEET_MANAGER, Role.DRIVER] },
  { href: '/maintenance',   label: 'Maintenance',   icon: Wrench,          roles: [Role.FLEET_MANAGER] },
  { href: '/fuel-expenses', label: 'Fuel & Expenses', icon: Fuel,          roles: [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST] },
  { href: '/reports',       label: 'Reports',       icon: PieChart,        roles: [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role as Role

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-r border-slate-800/50 shadow-2xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-800/60">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Transit<span className="text-blue-400">Ops</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Navigation</p>
        {routes.map((route) => {
          if (userRole && !route.roles.includes(userRole) && userRole !== Role.FLEET_MANAGER) return null
          const isActive = pathname.startsWith(route.href)
          const Icon = route.icon
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/10 text-white border border-blue-500/20 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              )}
            >
              <div className={cn(
                'h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                isActive
                  ? 'bg-gradient-to-br from-blue-500 to-violet-600 shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 group-hover:bg-slate-700'
              )}>
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
              </div>
              {route.label}
              {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800/60">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/40 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
            {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
            <p className="text-[11px] text-slate-400 capitalize truncate">{session?.user?.role?.replace(/_/g, ' ').toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center">
            <LogOut className="h-3.5 w-3.5" />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  )
}
