import { prisma } from '@/lib/prisma'
import { MaintenanceStatus, VehicleStatus } from '@prisma/client'

export async function openMaintenance(vehicleId: string, description: string, cost: number) {
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) throw new Error('Vehicle not found')
    
    // Check if it's already retired or on trip
    if (vehicle.status === VehicleStatus.RETIRED) throw new Error('Cannot maintain a retired vehicle')
    if (vehicle.status === VehicleStatus.ON_TRIP) throw new Error('Cannot maintain a vehicle currently on trip')

    // Rule: Creating active OPEN maintenance sets vehicle status to IN_SHOP
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { status: VehicleStatus.IN_SHOP }
    })

    return tx.maintenanceLog.create({
      data: {
        vehicleId,
        description,
        cost,
        status: MaintenanceStatus.OPEN
      }
    })
  })
}

export async function closeMaintenance(maintenanceId: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.findUnique({
      where: { id: maintenanceId },
      include: { vehicle: true }
    })

    if (!log) throw new Error('Maintenance record not found')
    if (log.status === MaintenanceStatus.CLOSED) throw new Error('Maintenance record is already closed')

    // Rule: Closing maintenance record restores vehicle to AVAILABLE unless it has been marked RETIRED
    const newVehicleStatus = log.vehicle.status === VehicleStatus.RETIRED 
      ? VehicleStatus.RETIRED 
      : VehicleStatus.AVAILABLE

    await tx.vehicle.update({
      where: { id: log.vehicleId },
      data: { status: newVehicleStatus }
    })

    return tx.maintenanceLog.update({
      where: { id: maintenanceId },
      data: {
        status: MaintenanceStatus.CLOSED,
        endDate: new Date()
      }
    })
  })
}
