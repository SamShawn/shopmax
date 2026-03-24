import Redis from 'ioredis'

// Redis 单例
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      retryStrategy(times) {
        if (times > 3) {
          return null
        }
        return Math.min(times * 100, 3000)
      },
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
  }
  return redis
}

// 缓存前缀
const CACHE_PREFIX = {
  PRODUCT: 'product:',
  PRODUCT_LIST: 'product:list:',
  CART: 'cart:',
  SESSION: 'session:',
  RATE_LIMIT: 'rate_limit:',
}

/**
 * 产品缓存
 */
export const productCache = {
  async get(productId: string) {
    const redis = getRedisClient()
    const data = await redis.get(CACHE_PREFIX.PRODUCT + productId)
    return data ? JSON.parse(data) : null
  },

  async set(productId: string, data: any, ttl = 3600) {
    const redis = getRedisClient()
    await redis.set(CACHE_PREFIX.PRODUCT + productId, JSON.stringify(data), 'EX', ttl)
  },

  async invalidate(productId: string) {
    const redis = getRedisClient()
    await redis.del(CACHE_PREFIX.PRODUCT + productId)
    await redis.del(CACHE_PREFIX.PRODUCT_LIST + '*')
  },

  async invalidateAll() {
    const redis = getRedisClient()
    const keys = await redis.keys(CACHE_PREFIX.PRODUCT + '*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  },
}

/**
 * 产品列表缓存（支持按分类）
 */
export const productListCache = {
  async get(category?: string) {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.PRODUCT_LIST + (category || 'all')
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  },

  async set(category: string | undefined, data: { products: any[]; total: number }, ttl = 600) {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.PRODUCT_LIST + (category || 'all')
    await redis.set(key, JSON.stringify(data), 'EX', ttl)
  },

  async invalidate() {
    const redis = getRedisClient()
    const keys = await redis.keys(CACHE_PREFIX.PRODUCT_LIST + '*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  },
}

/**
 * 购物车缓存（使用 Redis 存储未登录用户的购物车）
 */
export const cartCache = {
  async get(cartId: string) {
    const redis = getRedisClient()
    const data = await redis.get(CACHE_PREFIX.CART + cartId)
    return data ? JSON.parse(data) : { items: [] }
  },

  async set(cartId: string, cartData: any, ttl = 86400) {
    const redis = getRedisClient()
    await redis.set(CACHE_PREFIX.CART + cartId, JSON.stringify(cartData), 'EX', ttl)
  },

  async addItem(cartId: string, productId: string, quantity: number) {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.CART + cartId
    const cart = await this.get(cartId)

    const existingIndex = cart.items.findIndex((item: any) => item.id === productId)
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity
    } else {
      cart.items.push({ id: productId, quantity })
    }

    await redis.set(key, JSON.stringify(cart), 'EX', 86400)
    return cart
  },

  async removeItem(cartId: string, productId: string) {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.CART + cartId
    const cart = await this.get(cartId)

    cart.items = cart.items.filter((item: any) => item.id !== productId)

    await redis.set(key, JSON.stringify(cart), 'EX', 86400)
    return cart
  },

  async updateQuantity(cartId: string, productId: string, quantity: number) {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.CART + cartId
    const cart = await this.get(cartId)

    const item = cart.items.find((item: any) => item.id === productId)
    if (item) {
      item.quantity = quantity
    }

    await redis.set(key, JSON.stringify(cart), 'EX', 86400)
    return cart
  },

  async clear(cartId: string) {
    const redis = getRedisClient()
    await redis.del(CACHE_PREFIX.CART + cartId)
  },
}

/**
 * 限流器
 */
export const rateLimiter = {
  async check(identifier: string, { maxRequests = 10, window = 60 } = {}): Promise<boolean> {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.RATE_LIMIT + identifier
    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, window)
    }

    return current <= maxRequests
  },

  async getRemaining(identifier: string): Promise<number> {
    const redis = getRedisClient()
    const key = CACHE_PREFIX.RATE_LIMIT + identifier
    const current = parseInt((await redis.get(key)) || '0', 10)
    const ttl = await redis.ttl(key)
    return Math.max(0, 10 - current)
  },
}
