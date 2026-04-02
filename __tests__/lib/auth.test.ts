import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateToken, verifyToken, getCurrentUser, setAuthCookie, clearAuthCookie, JWTPayload } from '@/lib/auth'
import jwt from 'jsonwebtoken'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

describe('lib/auth', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload: JWTPayload = {
        userId: 'user_1',
        email: 'test@example.com',
      }

      const token = generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT format: header.payload.signature
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload: JWTPayload = {
        userId: 'user_1',
        email: 'test@example.com',
      }

      const token = generateToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).not.toBeNull()
      expect(decoded?.userId).toBe('user_1')
      expect(decoded?.email).toBe('test@example.com')
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid-token')
      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = verifyToken('header.payload.signature')
      expect(result).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return null when no token exists', async () => {
      const { cookies } = await import('next/headers')
      const mockCookies = vi.mocked(cookies)
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      const result = await getCurrentUser()
      expect(result).toBeNull()
    })

    it('should return user payload for valid token', async () => {
      const payload: JWTPayload = {
        userId: 'user_1',
        email: 'test@example.com',
      }
      const token = generateToken(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = vi.mocked(cookies)
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: token }),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      const result = await getCurrentUser()
      expect(result?.userId).toBe('user_1')
      expect(result?.email).toBe('test@example.com')
    })

    it('should return null for invalid token', async () => {
      const { cookies } = await import('next/headers')
      const mockCookies = vi.mocked(cookies)
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: 'invalid-token' }),
        set: vi.fn(),
        delete: vi.fn(),
      } as any)

      const result = await getCurrentUser()
      expect(result).toBeNull()
    })
  })
})