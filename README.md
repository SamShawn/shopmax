# Shopmax - Modern E-Commerce Platform

A full-stack e-commerce platform built with Next.js 14, React 18, Stripe, PostgreSQL, and Redis.

## Features

- **Shopping Cart**: Guest and logged-in user support with Redis/PostgreSQL storage
- **Product Search**: Full-text search across product catalog
- **Product Reviews**: Ratings and reviews system for products
- **Address Management**: Save and manage multiple shipping addresses
- **Checkout**: Stripe payment integration
- **Order Tracking**: View and track order status
- **Admin Dashboard**: Product management (CRUD operations)
- **Modern UI**: Tailwind CSS with Radix UI components

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.13 (App Router) |
| UI Library | React 18.3.1 |
| Styling | Tailwind CSS 3.4.13 |
| Components | Radix UI |
| Database | PostgreSQL with Prisma 5.19.0 |
| Cache | Redis with ioredis |
| Payments | Stripe 16.12.0 |
| Authentication | JWT with bcryptjs |
| Testing | Vitest 4.1.2 + Playwright 1.59.1 |
| Validation | Zod 3.23.8 |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis
- Stripe account

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure environment variables
# See Environment Variables section below

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
shopmax/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── addresses/        # Address management API
│   │   ├── auth/             # Authentication endpoints
│   │   ├── cart/             # Shopping cart API
│   │   ├── checkout/         # Stripe checkout & webhook
│   │   ├── orders/           # Order management API
│   │   └── products/         # Products API
│   │       ├── search/       # Product search
│   │       └── [id]/
│   │           └── reviews/  # Product reviews
│   ├── admin/                # Admin dashboard
│   ├── cart/                 # Cart page
│   ├── category/[name]/      # Category pages
│   ├── checkout/             # Checkout flow
│   ├── products/[id]/        # Product detail page
│   ├── register/             # Registration page
│   └── search/               # Search page
│
├── components/               # React components
│   ├── ui/                   # Radix UI based components
│   ├── address-form.tsx      # Address form
│   ├── address-list.tsx      # Address list
│   ├── cart-item.tsx         # Cart item
│   ├── cart-summary.tsx      # Cart totals
│   ├── header.tsx            # Navigation header
│   ├── product-card.tsx      # Product card
│   ├── product-reviews.tsx   # Product reviews
│   ├── review-form.tsx       # Review submission form
│   └── reviews.tsx           # Reviews list
│
├── hooks/                    # Custom React hooks
│   └── use-cart.ts           # Cart management
│   └── use-auth.ts           # Authentication
│
├── lib/                      # Utility libraries
│   ├── auth.ts               # JWT & bcrypt utilities
│   ├── prisma.ts             # Prisma client
│   ├── redis.ts              # Redis client & caching
│   ├── stripe.ts             # Stripe client
│   └── utils.ts              # General utilities
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data script
│
└── __tests__/                # Test files
    └── ...
```

## Database Schema

### Core Models

- **User**: Authentication, profile, Stripe customer ID
- **Product**: Name, description, price, stock, category, image
- **CartItem**: Shopping cart items (logged-in users)
- **Order**: Order status, total, payment info, addresses
- **OrderItem**: Snapshot of product at order time
- **Address**: User shipping addresses with default flag
- **Review**: Product ratings and reviews

### Key Design Decisions

- **Order Snapshot**: Stores product price, name, image at order time
- **Soft Delete**: Products use `isActive` flag for data integrity
- **Decimal Precision**: Prices use `Decimal` type for financial accuracy
- **Dual Cart Storage**: Guest carts in Redis, user carts in PostgreSQL

## Redis Usage

### Cache Keys

| Key Pattern | Data | TTL |
|-------------|------|-----|
| `product:{id}` | Product details | 1 hour |
| `product:list:{category}` | Product list | 10 minutes |
| `cart:{cartId}` | Guest cart | 24 hours |
| `session:{token}` | User session | 7 days |

### Use Cases

1. **Product Caching**: Reduce database load for frequently accessed products
2. **Guest Cart**: Store cart for anonymous users
3. **Session Management**: JWT token blacklisting
4. **API Rate Limiting**: Prevent abuse

## Stripe Integration

### Payment Flow

1. User adds items to cart
2. Client requests checkout session from `/api/checkout/create-session`
3. Server creates Stripe Checkout Session
4. User completes payment on Stripe-hosted page
5. Stripe webhook at `/api/checkout/webhook` confirms payment
6. Order created, inventory updated, cart cleared

### Webhook Events

- `checkout.session.completed`: Create order, update stock
- `payment_intent.succeeded`: Payment confirmation
- `payment_intent.payment_failed`: Handle failed payments

## API Endpoints

### Authentication
```
POST   /api/auth/register     Create new account
POST   /api/auth/login        Login user
POST   /api/auth/logout       Logout user
GET    /api/auth/me           Get current user
```

### Products
```
GET    /api/products              List all products
GET    /api/products/[id]         Get product details
POST   /api/products              Create product (admin)
PUT    /api/products/[id]         Update product (admin)
DELETE /api/products/[id]         Delete product (admin)
GET    /api/products/search       Search products
GET    /api/products/[id]/reviews Get product reviews
POST   /api/products/[id]/reviews Add review
```

### Cart
```
GET    /api/cart              Get cart items
POST   /api/cart              Add item to cart
PUT    /api/cart              Update item quantity
DELETE /api/cart              Clear cart
DELETE /api/cart?productId=X  Remove specific item
```

### Addresses
```
GET    /api/addresses              List user addresses
POST   /api/addresses              Create address
PUT    /api/addresses/[id]         Update address
DELETE /api/addresses/[id]         Delete address
PUT    /api/addresses/[id]/default Set default address
```

### Orders
```
GET    /api/orders           List user orders
GET    /api/orders/[id]      Get order details
```

### Checkout
```
POST   /api/checkout/create-session  Create Stripe session
POST   /api/checkout/webhook         Stripe webhook handler
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm run test             # Run unit tests (watch mode)
npm run test:run         # Run unit tests once
npm run test:coverage    # Run with coverage
npm run test:ui          # Open Vitest UI
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Open Playwright UI
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shopmax"

# Redis
REDIS_URL="redis://localhost:6379"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Default Credentials

After running the seed script:

- **Email**: `demo@example.com`
- **Password**: `password123`

## Testing

### Unit Tests (Vitest)
- Located in `__tests__/`
- Component testing with React Testing Library
- Mocked MSW for API mocking
- Coverage reporting with v8

### E2E Tests (Playwright)
- Located in `e2e/`
- Full browser testing
- Located in `test-results/` and `playwright-report/`

## License

MIT