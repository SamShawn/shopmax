import type { User } from '@prisma/client'

export const mockUser: User & { password?: string } = {
  id: 'user_1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password',
  imageUrl: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockUserInput = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
}

export const createUserInput = (overrides = {}) => ({
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  name: 'New User',
  ...overrides,
})