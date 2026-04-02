import { vi } from 'vitest'

export const mockStripe = {
  customers: {
    create: vi.fn().mockResolvedValue({ id: 'cus_test123', email: 'test@test.com' }),
    retrieve: vi.fn().mockResolvedValue({ id: 'cus_test123', email: 'test@test.com' }),
  },
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'cs_test123',
        url: 'https://checkout.stripe.com/test',
        payment_status: 'unpaid',
        status: 'open',
      }),
      retrieve: vi.fn().mockResolvedValue({
        id: 'cs_test123',
        payment_status: 'paid',
        status: 'complete',
        customer: 'cus_test123',
        metadata: { userId: 'user_1', shippingAddress: '{}' },
      }),
    },
  },
  webhooks: {
    constructEvent: vi.fn((payload: string, _signature: string, _secret: string) => {
      return JSON.parse(payload)
    }),
  },
}

export default mockStripe