import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'
import { getLicenseExpiryTemplate } from '@/lib/email-templates'
import { differenceInDays } from 'date-fns'

export async function GET(request: Request) {
  // In a real app, you should protect this route with a secret key
  // const authHeader = request.headers.get('authorization')
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  try {
    const drivers = await prisma.driver.findMany({
      where: {
        status: { not: 'SUSPENDED' } // don't care about suspended drivers
      }
    })

    const today = new Date()
    let emailsSent = 0

    for (const driver of drivers) {
      const daysUntilExpiry = differenceInDays(driver.licenseExpiryDate, today)

      let triggerDays = null
      if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
        triggerDays = 7
      } else if (daysUntilExpiry <= 15 && daysUntilExpiry > 7) {
        triggerDays = 15
      } else if (daysUntilExpiry <= 30 && daysUntilExpiry > 15) {
        triggerDays = 30
      }

      // If they hit a trigger window, and we haven't already reminded them for this window
      if (triggerDays !== null && driver.lastLicenseReminderDays !== triggerDays) {
        await sendEmail({
          to: driver.email,
          subject: `Urgent: License Expiring in ${daysUntilExpiry} Days - TransitOps`,
          html: getLicenseExpiryTemplate(driver.name, daysUntilExpiry, driver.licenseExpiryDate)
        })

        await prisma.driver.update({
          where: { id: driver.id },
          data: { lastLicenseReminderDays: triggerDays }
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
