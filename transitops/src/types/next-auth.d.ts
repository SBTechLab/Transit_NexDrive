import 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
    forcePasswordChange: boolean
  }

  interface Session {
    user: User & {
      id: string
      role: Role
      forcePasswordChange: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    forcePasswordChange: boolean
  }
}
