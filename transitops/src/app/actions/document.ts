'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addVehicleDocumentAction(data: {
  vehicleId: string
  name: string
  documentType: string
  expiryDate?: string
  fileUrl?: string
}) {
  try {
    await prisma.vehicleDocument.create({
      data: {
        vehicleId: data.vehicleId,
        name: data.name,
        documentType: data.documentType,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        fileUrl: data.fileUrl || null,
      },
    })
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function deleteVehicleDocumentAction(id: string) {
  try {
    await prisma.vehicleDocument.delete({ where: { id } })
    revalidatePath('/vehicles')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
