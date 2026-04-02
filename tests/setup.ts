import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// 清理每次测试后的 React 组件
afterEach(() => {
  cleanup()
})

// Mock lib/utils - 使用简单的函数 mock
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: unknown[]) => inputs.filter(Boolean).join(' '),
  formatPrice: (price: number | string) => `$${price}`,
  formatDate: (date: Date | string) => new Date(date).toLocaleDateString(),
  formatDateTime: (date: Date | string) => new Date(date).toLocaleString(),
}))

// Mock UI components - 返回简单的函数而不是 JSX
vi.mock('@/components/ui/card', () => ({
  Card: vi.fn((props: any) => props.children),
  CardContent: vi.fn((props: any) => props.children),
  CardFooter: vi.fn((props: any) => props.children),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn((props: any) => props.children),
}))

// Mock Next.js headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: vi.fn().mockReturnValue(new Headers()),
}))

// Mock Next.js/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`Redirect to ${url}`)
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock console.error for expected warnings
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0]
    if (
      typeof firstArg === 'string' &&
      (firstArg.includes('Warning: ReactDOM.render') ||
        firstArg.includes('Warning: An update to') ||
        firstArg.includes('Warning: When called with one or more'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})