import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

/**
 * POST /api/auth/logout
 * 用户登出
 */
export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to logout:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
