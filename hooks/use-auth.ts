'use client'

import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    console.log('[useAuth] fetchUser called')
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      console.log('[useAuth] response status:', res.status)
      const data = await res.json()
      console.log('[useAuth] response data:', data)
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('[useAuth] fetchUser error:', err)
      setUser(null)
    } finally {
      console.log('[useAuth] fetchUser completed')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // 监听自定义事件，用于跨组件状态同步
    const handleAuthChange = () => fetchUser()
    window.addEventListener('auth-refresh', handleAuthChange)
    return () => window.removeEventListener('auth-refresh', handleAuthChange)
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.dispatchEvent(new CustomEvent('auth-refresh'))
      window.location.href = '/login'
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return { user, loading, logout }
}
