import { Role } from '@prisma/client'

const routePermissions: Record<string, Role[]> = {
  '/dashboard':     [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER],
  '/vehicles':      [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER],
  '/drivers':       [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.DRIVER],
  '/trips':         [Role.FLEET_MANAGER, Role.DRIVER],
  '/maintenance':   [Role.FLEET_MANAGER],
  '/fuel-expenses': [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST],
  '/reports':       [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST],
  '/change-password': [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER],
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  const match = Object.keys(routePermissions).find(route => pathname.startsWith(route))
  if (!match) return true
  return routePermissions[match].includes(role)
}

export function getRoleLabel(role: Role): string {
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    [Role.FLEET_MANAGER]:     'bg-blue-100 text-blue-700',
    [Role.SAFETY_OFFICER]:    'bg-green-100 text-green-700',
    [Role.FINANCIAL_ANALYST]: 'bg-violet-100 text-violet-700',
    [Role.DRIVER]:            'bg-orange-100 text-orange-700',
  }
  return colors[role] ?? 'bg-gray-100 text-gray-700'
}
