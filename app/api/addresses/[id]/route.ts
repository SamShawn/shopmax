import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/addresses/[id]
 * 获取单个地址详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const address = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Failed to fetch address:', error)
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 })
  }
}

/**
 * PUT /api/addresses/[id]
 * 更新地址
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

    const body = await request.json()
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = body

    // If setting as default, clear other defaults first
    if (isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(phone !== undefined && { phone }),
        ...(isDefault !== undefined && { isDefault }),
      },
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Failed to update address:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

/**
 * DELETE /api/addresses/[id]
 * 删除地址
 */
export async function DELETE(
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

    await prisma.address.delete({
      where: { id },
    })

    // If deleted address was default, set another as default
    if (existing.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete address:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}