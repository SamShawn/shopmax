import { NextResponse } from 'next/server'

/**
 * GET /api/auth/github
 * 重定向到 GitHub 授权页面
 */
export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`

  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    )
  }

  // 生成 state 参数防止 CSRF 攻击
  const state = Math.random().toString(36).substring(2, 15)

  const scopes = ['user:email', 'read:user'].join(' ')

  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('state', state)

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