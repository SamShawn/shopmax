import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'

/**
 * GET /api/auth/github/callback
 * 处理 GitHub OAuth 回调
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // 处理 OAuth 错误
  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=missing_code`)
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_not_configured`)
  }

  try {
    // 1. 用 code 换取 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=token_exchange_failed`)
    }

    // 2. 用 access_token 获取用户信息
    const userInfoResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    })

    const userInfo = await userInfoResponse.json()

    // 3. 获取用户邮箱 (GitHub 可能不公开邮箱)
    let email = userInfo.email
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      })
      const emails = await emailsResponse.json()
      const primaryEmail = emails.find((e: { primary: boolean }) => e.primary)
      email = primaryEmail?.email
    }

    if (!email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_email`)
    }

    // 4. 在数据库中查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // 新用户，创建账户
      user = await prisma.user.create({
        data: {
          email,
          name: userInfo.name || userInfo.login,
          avatar: userInfo.avatar_url,
          provider: 'github',
          providerId: String(userInfo.id),
          password: null, // OAuth 登录不需要密码
        },
      })
    } else if (!user.provider) {
      // 已存在本地账户，关联 GitHub
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name || userInfo.login || user.name,
          avatar: userInfo.avatar_url || user.avatar,
          provider: 'github',
          providerId: String(userInfo.id),
        },
      })
    } else if (user.provider !== 'github') {
      // 同一邮箱被其他 provider 使用
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=email_already_used`
      )
    }

    // 5. 生成 JWT 并设置 cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    await setAuthCookie(token)

    // 6. 重定向到首页
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`)
  }
}