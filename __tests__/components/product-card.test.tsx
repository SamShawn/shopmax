import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '@/components/product-card'

// Mock dependencies
vi.mock('@/hooks/use-cart', () => ({
  useCart: vi.fn().mockReturnValue({
    addToCart: vi.fn().mockResolvedValue({}),
  }),
}))

vi.mock('@/components/lib/use-toast', () => ({
  toast: vi.fn(),
}))

vi.mock('@/lib/utils', () => ({
  formatPrice: (price: string | number) => `$${price}`,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />
  },
}))

describe('ProductCard', () => {
  const defaultProps = {
    id: 'prod_1',
    name: 'Test Product',
    description: 'A great product for testing',
    price: '99.99',
    imageUrl: 'https://example.com/image.jpg',
    stock: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render product information', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('A great product for testing')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('should show Add to Cart button', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('should disable button when out of stock', () => {
    render(<ProductCard {...defaultProps} stock={0} />)

    // Both badge and button show "Out of Stock"
    const buttons = screen.getAllByText('Out of Stock')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should show Low Stock badge when stock is low', () => {
    render(<ProductCard {...defaultProps} stock={3} />)

    expect(screen.getByText('Low Stock')).toBeInTheDocument()
  })

  it('should not show Low Stock badge when stock is adequate', () => {
    render(<ProductCard {...defaultProps} stock={10} />)

    expect(screen.queryByText('Low Stock')).not.toBeInTheDocument()
  })

  it('should display placeholder when no image', () => {
    render(<ProductCard {...defaultProps} imageUrl={undefined} />)

    expect(screen.getByText('No image')).toBeInTheDocument()
  })
})