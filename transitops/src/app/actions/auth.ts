'use server'

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'
import { getForgotPasswordTemplate, getPasswordChangedTemplate } from '@/lib/email-templates'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Return success to avoid email enumeration
    return { success: true }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - TransitOps',
    html: getForgotPasswordTemplate(resetUrl)
  })

  return { success: true }
}

export async function resetPassword(token: string, newPassword: string) {
  if (!token) return { success: false, error: 'Invalid token' }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() }
    }
  })

  if (!user) return { success: false, error: 'Token is invalid or has expired' }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
      forcePasswordChange: false // Resetting password clears the force flag
    }
  })

  await sendEmail({
    to: user.email,
    subject: 'Password Changed - TransitOps',
    html: getPasswordChangedTemplate()
  })

  return { success: true }
}

export async function changePassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      forcePasswordChange: false
    }
  })

  return { success: true }
}
