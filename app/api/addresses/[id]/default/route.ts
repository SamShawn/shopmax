import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * PUT /api/addresses/[id]/default
 * 将地址设为默认
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Clear other defaults
    await prisma.address.updateMany({
      where: { userId: user.userId, isDefault: true },
      data: { isDefault: false },
    })

    // Set this as default
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Failed to set default address:', error)
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 })
  }
}