import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserByClerkId, updateUser } from '@/features/auth/server/user-service'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify required fields are filled
    if (!user.clinicName || !user.clinicPhone) {
      return NextResponse.json(
        { error: 'Please complete your clinic profile first' },
        { status: 400 }
      )
    }

    await updateUser(user.id, {
      onboardingCompleted: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
