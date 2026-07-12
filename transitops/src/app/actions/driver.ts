'use server'

import { createDriver, updateDriver } from '@/services/driverService'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createDriverAction(data: Prisma.DriverCreateInput) {
  try {
    await createDriver(data)
    revalidatePath('/drivers')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function updateDriverAction(id: string, data: Prisma.DriverUpdateInput) {
  try {
    await updateDriver(id, data)
    revalidatePath('/drivers')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
