import { prisma } from '@/lib/prisma'
import { DriverStatus, Prisma, Role } from '@prisma/client'
import { sendEmail } from '@/lib/mail'
import { getDriverSuspendedTemplate } from '@/lib/email-templates'

export async function createDriver(data: Prisma.DriverCreateInput) {
  const existing = await prisma.driver.findUnique({ where: { licenseNumber: data.licenseNumber } })
  if (existing) throw new Error('Driver license number must be unique')
  
  return prisma.driver.create({ data })
}

export async function updateDriver(id: string, data: Prisma.DriverUpdateInput) {
  const driver = await prisma.driver.update({
    where: { id },
    data
  })

  // Email on suspension
  if (data.status === DriverStatus.SUSPENDED) {
    // Notify Driver
    if (driver.email) {
      sendEmail({
        to: driver.email,
        subject: `Notice: Driver Suspended`,
        html: getDriverSuspendedTemplate(driver.name)
      })
    }

    // Notify Safety Officers
    prisma.user.findMany({ where: { role: Role.SAFETY_OFFICER } }).then(officers => {
      const officerEmails = officers.map(o => o.email)
      if (officerEmails.length > 0) {
        sendEmail({
          to: officerEmails,
          subject: `Alert: Driver Suspended - ${driver.name}`,
          html: getDriverSuspendedTemplate(driver.name)
        })
      }
    })
  }

  return driver
}

export async function getDrivers() {
  return prisma.driver.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Get drivers eligible for trip dispatch
export async function getEligibleDrivers() {
  return prisma.driver.findMany({
    where: {
      status: {
        notIn: [DriverStatus.SUSPENDED, DriverStatus.ON_TRIP, DriverStatus.OFF_DUTY]
      },
      licenseExpiryDate: {
        gte: new Date() // License must not be expired
      }
    }
  })
}
