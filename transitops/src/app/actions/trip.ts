'use server'

import { dispatchTrip, completeTrip, cancelTrip } from '@/services/tripService'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createTripAction(data: Omit<Prisma.TripCreateInput, 'vehicle' | 'driver'> & { vehicleId: string, driverId: string }) {
  try {
    const { vehicleId, driverId, ...rest } = data
    await prisma.trip.create({
      data: {
        ...rest,
        vehicle: { connect: { id: vehicleId } },
        driver: { connect: { id: driverId } }
      }
    })
    revalidatePath('/trips')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function dispatchTripAction(id: string) {
  try {
    await dispatchTrip(id)
    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function completeTripAction(id: string, actualDistanceKm: number, fuelConsumedLiters: number) {
  try {
    await completeTrip(id, actualDistanceKm, fuelConsumedLiters)
    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function cancelTripAction(id: string) {
  try {
    await cancelTrip(id)
    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
