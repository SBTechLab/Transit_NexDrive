'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function addExpenseAction(data: Omit<Prisma.ExpenseCreateInput, 'vehicle'> & { vehicleId: string }) {
  try {
    const { vehicleId, ...rest } = data
    await prisma.expense.create({
      data: {
        ...rest,
        vehicle: { connect: { id: vehicleId } }
      }
    })
    revalidatePath('/fuel-expenses')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function addFuelLogAction(data: Omit<Prisma.FuelLogCreateInput, 'vehicle' | 'trip'> & { vehicleId: string, tripId?: string }) {
  try {
    const { vehicleId, tripId, ...rest } = data
    await prisma.fuelLog.create({
      data: {
        ...rest,
        vehicle: { connect: { id: vehicleId } },
        ...(tripId && { trip: { connect: { id: tripId } } })
      }
    })
    revalidatePath('/fuel-expenses')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
