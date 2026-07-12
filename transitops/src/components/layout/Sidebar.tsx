'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  PieChart, 
  LogOut 
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Role } from '@prisma/client'

const routes = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER] },
  { href: '/vehicles', label: 'Vehicles', icon: Truck, roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER] },
  { href: '/drivers', label: 'Drivers', icon: Users, roles: [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.DRIVER] },
  { href: '/trips', label: 'Trips', icon: Map, roles: [Role.FLEET_MANAGER, Role.DRIVER] },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench, roles: [Role.FLEET_MANAGER] },
  { href: '/fuel-expenses', label: 'Fuel & Expenses', icon: Fuel, roles: [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST] },
  { href: '/reports', label: 'Reports', icon: PieChart, roles: [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userRole = session?.user?.role as Role

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-950 text-slate-300">
      <div className="flex h-16 items-center justify-center border-b border-slate-800 bg-slate-900">
        <h1 className="text-xl font-bold text-white tracking-wider uppercase">Transit<span className="text-primary">Ops</span></h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {routes.map((route) => {
          // Simplistic RBAC filter for UI links
          if (userRole && !route.roles.includes(userRole) && userRole !== Role.FLEET_MANAGER) return null

          const isActive = pathname.startsWith(route.href)
          const Icon = route.icon

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {route.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{session?.user?.role?.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
