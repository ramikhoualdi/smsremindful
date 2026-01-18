import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validatePhoneNumber } from '@/lib/phone/validation'
import { getAdminDb } from '@/lib/firebase/admin'

const validateSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  appointmentId: z.string().optional(), // If provided, updates the appointment
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = validateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { phoneNumber, appointmentId } = parsed.data

    // Validate the phone number
    const result = await validatePhoneNumber(phoneNumber)

    // If appointmentId provided and validation successful, update the appointment
    if (appointmentId && result.valid) {
      try {
        await getAdminDb()
          .collection('appointments')
          .doc(appointmentId)
          .update({
            patientPhone: result.phoneNumber, // Store normalized E.164 format
            phoneValidated: true,
            phoneType: result.carrierType,
            phoneValidatedAt: new Date(),
            phoneCanReceiveSMS: result.canReceiveSMS,
            updatedAt: new Date(),
          })
      } catch (error) {
        console.error('Failed to update appointment:', error)
        // Don't fail the request, just return the validation result
      }
    }

    return NextResponse.json({
      success: true,
      validation: {
        valid: result.valid,
        phoneNumber: result.phoneNumber,
        countryCode: result.countryCode,
        carrierType: result.carrierType,
        carrierName: result.carrierName,
        canReceiveSMS: result.canReceiveSMS,
        cached: result.cached,
      },
      warning: !result.canReceiveSMS
        ? result.carrierType === 'landline'
          ? 'This is a landline number and cannot receive SMS messages.'
          : result.carrierType === 'unknown'
            ? 'Could not determine if this number can receive SMS.'
            : undefined
        : undefined,
    })
  } catch (error) {
    console.error('Phone validation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation failed' },
      { status: 500 }
    )
  }
}
