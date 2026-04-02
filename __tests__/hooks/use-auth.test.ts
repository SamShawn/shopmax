import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'

// Mock fetch globally
global.fetch = vi.fn()

// Mock window.location
const mockLocation = {
  href: '',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should load user on mount', async () => {
    const mockUser = {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ user: mockUser }),
    } as Response)

    const { result } = renderHook(() => useAuth())

    // Initially loading should be true
    expect(result.current.loading).toBe(true)

    // Wait for the hook to finish loading
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith('/api/auth/me')
  })

  it('should set user to null when not authenticated', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toBeNull()
  })

  it('should handle API error gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toBeNull()
  })

  it('should logout and redirect', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response)

    const { result } = renderHook(() => useAuth())

    await result.current.logout()

    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    expect(result.current.user).toBeNull()
    expect(window.location.href).toBe('/login')
  })

  it('should handle logout error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuth())

    await result.current.logout()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})