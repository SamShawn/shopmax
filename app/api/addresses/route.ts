import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/addresses
 * 获取用户地址列表
 */
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

/**
 * POST /api/addresses
 * 添加新地址
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = body

    // Validate required fields
    if (!fullName || !street || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      )
    }

    // If setting as default, clear other defaults first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Check if this is the first address
    const existingAddresses = await prisma.address.count({
      where: { userId: user.userId },
    })

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        fullName,
        street,
        city,
        state,
        zipCode,
        country,
        phone: phone || null,
        isDefault: isDefault || existingAddresses === 0,
      },
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Failed to create address:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}