import { prisma } from '@/lib/prisma'
import { VehicleStatus, Prisma } from '@prisma/client'

export async function createVehicle(data: Prisma.VehicleCreateInput) {
  // Rule: Vehicle registrationNumber must be unique ( Prisma handles this via @unique, but we can pre-check or handle error )
  const existing = await prisma.vehicle.findUnique({ where: { registrationNumber: data.registrationNumber } })
  if (existing) throw new Error('Vehicle registration number must be unique')
  
  return prisma.vehicle.create({ data })
}

export async function updateVehicle(id: string, data: Prisma.VehicleUpdateInput) {
  return prisma.vehicle.update({
    where: { id },
    data
  })
}

export async function retireVehicle(id: string) {
  return prisma.vehicle.update({
    where: { id },
    data: { status: VehicleStatus.RETIRED }
  })
}

export async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Get vehicles eligible for trip dispatch
export async function getEligibleVehicles() {
  return prisma.vehicle.findMany({
    where: {
      status: {
        notIn: [VehicleStatus.RETIRED, VehicleStatus.IN_SHOP, VehicleStatus.ON_TRIP]
      }
    }
  })
}
