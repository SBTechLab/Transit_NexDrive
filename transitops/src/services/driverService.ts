import { prisma } from '@/lib/prisma'
import { DriverStatus, Prisma } from '@prisma/client'

export async function createDriver(data: Prisma.DriverCreateInput) {
  const existing = await prisma.driver.findUnique({ where: { licenseNumber: data.licenseNumber } })
  if (existing) throw new Error('Driver license number must be unique')
  
  return prisma.driver.create({ data })
}

export async function updateDriver(id: string, data: Prisma.DriverUpdateInput) {
  return prisma.driver.update({
    where: { id },
    data
  })
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
