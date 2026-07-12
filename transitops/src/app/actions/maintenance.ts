'use server'

import { openMaintenance, closeMaintenance } from '@/services/maintenanceService'
import { revalidatePath } from 'next/cache'

export async function openMaintenanceAction(vehicleId: string, description: string, cost: number) {
  try {
    await openMaintenance(vehicleId, description, cost)
    revalidatePath('/maintenance')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function closeMaintenanceAction(id: string) {
  try {
    await closeMaintenance(id)
    revalidatePath('/maintenance')
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
