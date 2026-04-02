import { vi } from 'vitest'

// 内存中的 mock Redis 存储
const mockRedisStore = new Map<string, string>()

export const mockRedis = {
  get: vi.fn(async (key: string) => {
    return mockRedisStore.get(key) || null
  }),
  set: vi.fn(async (key: string, value: string, mode?: string, ttl?: number) => {
    mockRedisStore.set(key, value)
    return 'OK'
  }),
  del: vi.fn(async (...keys: string[]) => {
    keys.forEach((k) => mockRedisStore.delete(k))
    return keys.length
  }),
  incr: vi.fn(async (key: string) => {
    const current = parseInt(mockRedisStore.get(key) || '0', 10)
    const newValue = current + 1
    mockRedisStore.set(key, String(newValue))
    return newValue
  }),
  expire: vi.fn(async () => 1),
  ttl: vi.fn(async () => 60),
  keys: vi.fn(async (pattern: string) => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return Array.from(mockRedisStore.keys()).filter((k) => regex.test(k))
  }),
  on: vi.fn(),
  quit: vi.fn(async () => 'OK'),
}

export function clearMockRedis() {
  mockRedisStore.clear()
  vi.clearAllMocks()
}

// 为购物车缓存的专门 mock
export const cartCache = {
  get: mockRedis.get,
  set: mockRedis.set,
  addItem: vi.fn(async () => 'OK'),
  removeItem: mockRedis.del,
  updateQuantity: mockRedis.set,
  clear: vi.fn(async () => {
    const keys = await mockRedis.keys('cart:*')
    return mockRedis.del(...keys)
  }),
}