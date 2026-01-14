import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import { getAdminDb } from '@/lib/firebase/admin'

const updateAppointmentSchema = z.object({
  patientPhone: z.string().optional(),
  patientName: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH /api/appointments/[id] - Update an appointment
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateAppointmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Get the appointment and verify ownership
    const appointmentDoc = await getAdminDb()
      .collection('appointments')
      .doc(id)
      .get()

    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const appointmentData = appointmentDoc.data()
    if (appointmentData?.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build update data (convert undefined to null for Firestore)
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (parsed.data.patientPhone !== undefined) {
      updateData.patientPhone = parsed.data.patientPhone || null
    }
    if (parsed.data.patientName !== undefined) {
      updateData.patientName = parsed.data.patientName
    }

    await getAdminDb().collection('appointments').doc(id).update(updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}
