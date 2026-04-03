import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'

/**
 * GET /api/auth/google/callback
 * 处理 Google OAuth 回调
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // 处理 OAuth 错误
  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=missing_code`)
  }

  // 验证 state (简化处理)
  // 实际项目中应该从 cookie 中读取并验证

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_not_configured`)
  }

  try {
    // 1. 用 code 换取 access_token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=token exchange failed`)
    }

    // 2. 用 access_token 获取用户信息
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userInfo = await userInfoResponse.json()

    if (!userInfo.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_email`)
    }

    // 3. 在数据库中查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    })

    if (!user) {
      // 新用户，创建账户
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
          provider: 'google',
          providerId: userInfo.id,
          password: null, // OAuth 登录不需要密码
        },
      })
    } else if (!user.provider) {
      // 已存在本地账户，关联 Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name || user.name,
          avatar: userInfo.picture || user.avatar,
          provider: 'google',
          providerId: userInfo.id,
        },
      })
    } else if (user.provider !== 'google') {
      // 同一邮箱被其他 provider 使用
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=email_already_used`
      )
    }

    // 4. 生成 JWT 并设置 cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    await setAuthCookie(token)

    // 5. 重定向到首页
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`)
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`)
  }
}