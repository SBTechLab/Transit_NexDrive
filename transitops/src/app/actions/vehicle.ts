'use server'

import { createVehicle, updateVehicle, retireVehicle } from '@/services/vehicleService'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createVehicleAction(data: Prisma.VehicleCreateInput) {
  try {
    await createVehicle(data)
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function updateVehicleAction(id: string, data: Prisma.VehicleUpdateInput) {
  try {
    await updateVehicle(id, data)
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function retireVehicleAction(id: string) {
  try {
    await retireVehicle(id)
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
