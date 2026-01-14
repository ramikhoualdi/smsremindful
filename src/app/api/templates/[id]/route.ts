import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '@/features/templates/server/template-service'
import { updateTemplateSchema } from '@/features/templates/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/templates/[id] - Get a single template
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const template = await getTemplateById(id)

    if (!template || template.userId !== user.id) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}

// PATCH /api/templates/[id] - Update a template
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
    const parsed = updateTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await updateTemplate(id, user.id, parsed.data)
    const updated = await getTemplateById(id)

    return NextResponse.json({ template: updated })
  } catch (error) {
    console.error('Error updating template:', error)
    const message = error instanceof Error ? error.message : 'Failed to update template'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    await deleteTemplate(id, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete template'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
