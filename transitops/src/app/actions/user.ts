'use server'

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'
import { getNewUserTemplate } from '@/lib/email-templates'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { Role } from '@prisma/client'

export async function createUserAction({
  name,
  email,
  role,
}: {
  name: string
  email: string
  role: Role
}) {
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Generate random temp password and hash it
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash,
        forcePasswordChange: true,
      }
    })

    const loginUrl = `${process.env.NEXTAUTH_URL}/login`

    await sendEmail({
      to: user.email,
      subject: 'Welcome to TransitOps - Account Created',
      html: getNewUserTemplate(loginUrl, tempPassword)
    })

    return { success: true, data: user }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}
