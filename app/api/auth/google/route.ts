import { NextResponse } from 'next/server'

/**
 * GET /api/auth/google
 * 重定向到 Google 授权页面
 */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth not configured' },
      { status: 500 }
    )
  }

  // 生成 state 参数防止 CSRF 攻击
  const state = Math.random().toString(36).substring(2, 15)

  // 存储 state 到 cookie (简化处理，实际项目可使用加密的 cookie)
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' ')

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  // 将 state 存入 cookie 用于回调验证
  const response = NextResponse.redirect(authUrl.toString())
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 分钟
    path: '/',
  })

  return response
}