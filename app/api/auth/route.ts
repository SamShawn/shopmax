import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, generateToken, setAuthCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

/**
 * GET /api/auth/me
 * 获取当前用户信息
 */
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
