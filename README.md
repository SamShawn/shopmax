# Shopmax - Modern E-Commerce Platform

A full-stack e-commerce platform built with Next.js, Stripe, PostgreSQL, and Redis.

## Features

- 🛒 Shopping cart with guest and user support
- 💳 Stripe payment integration
- 📦 Product management with admin dashboard
- 📋 Order tracking and management
- 🎨 Modern UI with Tailwind CSS
- 🔐 JWT-based authentication
- ⚡ Redis caching for performance
- 💾 PostgreSQL with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Payments**: Stripe
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis
- Stripe account

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- `REDIS_URL`: Your Redis connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `JWT_SECRET`: A random secret string for JWT

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── api/              # API routes
│   ├── auth/         # Authentication endpoints
│   ├── cart/         # Shopping cart endpoints
│   ├── checkout/     # Checkout & payment endpoints
│   ├── orders/       # Order management endpoints
│   └── products/     # Product management endpoints
├── admin/            # Admin dashboard
├── checkout/         # Checkout flow pages
├── products/         # Product pages
└── category/         # Category pages

components/
├── ui/              # Reusable UI components
├── header.tsx        # Navigation header
├── product-card.tsx  # Product card component
└── ...

hooks/               # Custom React hooks
├── use-cart.ts      # Shopping cart hook
└── use-auth.ts      # Authentication hook

lib/                 # Utility libraries
├── prisma.ts        # Prisma client
├── redis.ts         # Redis client & cache utilities
├── stripe.ts        # Stripe client
├── auth.ts          # Authentication utilities
└── utils.ts         # General utilities

prisma/
├── schema.prisma     # Database schema
└── seed.ts          # Seed data script
```

## Database Schema

### User
- Basic user information and authentication
- Related to orders, addresses, and reviews

### Product
- Product details, pricing, and inventory
- Related to cart items, orders, and reviews

### CartItem
- Shopping cart items for logged-in users
- Guest carts are stored in Redis

### Order
- Order information and status
- Related to order items and user

### OrderItem
- Individual items in an order
- Stores product snapshot at order time

### Address
- User shipping addresses

### Review
- Product reviews and ratings

## Redis Usage

### Caching Strategy

1. **Product Cache**: Individual product details (TTL: 1 hour)
2. **Product List Cache**: Product listings by category (TTL: 10 minutes)
3. **Guest Cart**: Shopping carts for non-logged-in users (TTL: 24 hours)
4. **Rate Limiting**: API request rate limiting

### Cache Invalidation

- Product updates invalidate product and list caches
- Successful checkout clears guest cart

## Stripe Integration

### Payment Flow

1. User creates checkout session with cart items
2. Server creates Stripe Checkout Session with metadata
3. User completes payment on Stripe-hosted page
4. Stripe webhook confirms payment
5. Webhook creates order and updates inventory

### Webhook Events Handled

- `checkout.session.completed`: Order creation
- `payment_intent.succeeded`: Payment confirmation
- `payment_intent.failed`: Payment failure handling

## Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
         ↓
      CANCELLED
```

## Shopping Cart Logic

### Guest Users

- Cart stored in Redis with unique cart ID
- Cart ID stored in HTTP-only cookie
- Migrated to user cart on login

### Logged-in Users

- Cart stored in PostgreSQL
- Associated with user ID
- Persistent across sessions

## Admin Dashboard

Access at `/admin` when logged in. Features:

- View all products
- Add new products
- Edit existing products
- Delete products (soft delete)
- Search and filter products

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

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Build for production
npm run build

# Start production server
npm start
```

## Default Credentials

After running the seed script, you can login with:
- Email: `demo@example.com`
- Password: `password123`

## License

MIT
