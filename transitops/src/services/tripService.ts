import { prisma } from '@/lib/prisma'
import { TripStatus, VehicleStatus, DriverStatus } from '@prisma/client'

export async function dispatchTrip(tripId: string) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    })

    if (!trip) throw new Error('Trip not found')
    if (trip.status !== TripStatus.DRAFT) throw new Error('Only DRAFT trips can be dispatched')

    // Rule: Vehicles with status RETIRED or IN_SHOP must never appear (and cannot be dispatched)
    if (trip.vehicle.status === VehicleStatus.RETIRED || trip.vehicle.status === VehicleStatus.IN_SHOP) {
      throw new Error(`Vehicle is not available for dispatch (${trip.vehicle.status})`)
    }

    // Rule: Drivers with an expired license or status SUSPENDED cannot be assigned
    if (trip.driver.status === DriverStatus.SUSPENDED) {
      throw new Error('Driver is SUSPENDED')
    }
    if (new Date(trip.driver.licenseExpiryDate) < new Date()) {
      throw new Error('Driver license is expired')
    }

    // Rule: A vehicle or driver already ON_TRIP cannot be assigned to a second concurrent trip
    if (trip.vehicle.status === VehicleStatus.ON_TRIP) {
      throw new Error('Vehicle is already ON_TRIP')
    }
    if (trip.driver.status === DriverStatus.ON_TRIP) {
      throw new Error('Driver is already ON_TRIP')
    }

    // Rule: cargoWeightKg on a trip must not exceed vehicle's maxLoadCapacityKg
    if (trip.cargoWeightKg > trip.vehicle.maxLoadCapacityKg) {
      throw new Error('Cargo weight exceeds vehicle capacity')
    }

    // Rule: Dispatching a trip atomically sets vehicle and driver status to ON_TRIP
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: VehicleStatus.ON_TRIP }
    })

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.ON_TRIP }
    })

    return tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date()
      }
    })
  })
}

export async function completeTrip(tripId: string, actualDistanceKm: number, fuelConsumedLiters: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    })

    if (!trip) throw new Error('Trip not found')
    if (trip.status !== TripStatus.DISPATCHED) throw new Error('Only DISPATCHED trips can be completed')

    // Rule: Completing a trip atomically sets vehicle and driver back to AVAILABLE, and updates odometer
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
        odometerKm: {
          increment: actualDistanceKm
        }
      }
    })

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.AVAILABLE }
    })

    return tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.COMPLETED,
        actualDistanceKm,
        fuelConsumedLiters,
        completedAt: new Date()
      }
    })
  })
}

export async function cancelTrip(tripId: string) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    })

    if (!trip) throw new Error('Trip not found')
    
    // Only restoring status if the trip was actually dispatched
    if (trip.status === TripStatus.DISPATCHED) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE }
      })

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE }
      })
    }

    return tx.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.CANCELLED }
    })
  })
}
