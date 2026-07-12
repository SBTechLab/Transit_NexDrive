import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'
import { getLicenseExpiringTemplate } from '@/lib/email-templates'
import { differenceInDays } from 'date-fns'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    const [drivers, fleetManagers] = await Promise.all([
      prisma.driver.findMany({ where: { status: { not: 'SUSPENDED' } } }),
      prisma.user.findMany({ where: { role: Role.FLEET_MANAGER }, select: { email: true } }),
    ])

    if (fleetManagers.length === 0) {
      return NextResponse.json({ success: true, emailsSent: 0, message: 'No fleet managers found' })
    }

    const managerEmails = fleetManagers.map(m => m.email)
    const today = new Date()
    let emailsSent = 0

    for (const driver of drivers) {
      const daysUntilExpiry = differenceInDays(driver.licenseExpiryDate, today)

      let triggerDays: number | null = null
      if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) triggerDays = 7
      else if (daysUntilExpiry <= 15 && daysUntilExpiry > 7) triggerDays = 15
      else if (daysUntilExpiry <= 30 && daysUntilExpiry > 15) triggerDays = 30

      if (triggerDays !== null && driver.lastLicenseReminderDays !== triggerDays) {
        await sendEmail({
          to: managerEmails,
          subject: `⚠️ License Expiring in ${daysUntilExpiry} Days — ${driver.name}`,
          html: getLicenseExpiringTemplate(driver.name, daysUntilExpiry),
        })

        await prisma.driver.update({
          where: { id: driver.id },
          data: { lastLicenseReminderDays: triggerDays },
        })

        emailsSent++
      }
    }

    return NextResponse.json({ success: true, emailsSent })
  } catch (error: any) {
    console.error('License cron error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
