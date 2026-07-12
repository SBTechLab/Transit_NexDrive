import { Role } from '@prisma/client'

export const roleHierarchy = {
  [Role.FLEET_MANAGER]: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'],
  [Role.SAFETY_OFFICER]: ['SAFETY_OFFICER'],
  [Role.FINANCIAL_ANALYST]: ['FINANCIAL_ANALYST'],
  [Role.DRIVER]: ['DRIVER'],
}

export function hasRole(userRole: Role, requiredRole: Role) {
  return roleHierarchy[userRole]?.includes(requiredRole) ?? false
}

// Route permissions map
export const routePermissions: Record<string, Role[]> = {
  '/dashboard': [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER],
  '/vehicles': [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST, Role.DRIVER],
  '/drivers': [Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.DRIVER],
  '/trips': [Role.FLEET_MANAGER, Role.DRIVER],
  '/maintenance': [Role.FLEET_MANAGER],
  '/fuel-expenses': [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST],
  '/reports': [Role.FLEET_MANAGER, Role.FINANCIAL_ANALYST],
}

export function canAccessRoute(userRole: Role, pathname: string) {
  // Check exact route matches, or prefix matches
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole)
    }
  }
  
  // Default to deny if no route rule is matched but it's a protected route
  return false
}
