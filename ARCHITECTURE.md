# Shopora Architecture Design

## 1. System Overview

Shopora is a modern full-stack e-commerce platform using:
- **Next.js 14** with App Router for frontend and API
- **PostgreSQL** for persistent data storage
- **Redis** for caching and session management
- **Stripe** for payment processing
- **JWT** for authentication

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js SPA  │  │  React UI    │  │  Stripe JS   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          ▼                  │                  │
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Server                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Auth API   │  │  Cart API   │  │ Products API │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PostgreSQL   │  │  Redis      │  │  Stripe     │          │
│  │  (Prisma)   │  │  (Cache)    │  │  (Payments) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Database Schema Design

### PostgreSQL Tables

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // bcrypt hashed
  stripeCustomerId String? // Stripe customer ID
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  relations: orders, addresses, reviews
}
```

#### Product
```prisma
model Product {
  id            String    @id @default(cuid())
  name          String
  description   String
  price         Decimal   @db.Decimal(10, 2)
  stock         Int
  imageUrl      String?
  category      String?
  isActive      Boolean   // Soft delete support
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  relations: orderItems, reviews, cartItems

  indexes: category, isActive
}
```

#### CartItem (Logged-in users)
```prisma
model CartItem {
  id            String    @id @default(cuid())
  userId        String
  productId     String
  quantity      Int

  unique: [userId, productId]
}
```

#### Order
```prisma
model Order {
  id            String    @id @default(cuid())
  userId        String
  status        OrderStatus // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  totalAmount   Decimal
  stripePaymentId String
  stripeCustomerId String
  shippingAddress String  // JSON serialized
  billingAddress  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  relations: items, user
}
```

#### OrderItem
```prisma
model OrderItem {
  id            String    @id @default(cuid())
  orderId       String
  productId     String
  quantity      Int
  price         Decimal   // Price at order time
  productName   String   // Product name at order time
  productImage  String?
}
```

### Key Design Decisions

1. **Order Snapshot**: OrderItem stores `price`, `productName`, and `productImage` to preserve order details even if products change or are deleted.

2. **Soft Delete**: Products use `isActive` flag instead of actual deletion to preserve order history.

3. **Decimal Type**: Prices use `Decimal` type for precise financial calculations.

4. **Cart Separation**: Guest carts in Redis, user carts in PostgreSQL for clear separation of concerns.

## 4. Redis Data Structures

### Cache Keys Structure

```
product:{productId}           → JSON (product details, TTL: 1h)
product:list:{category}       → JSON (product list, TTL: 10m)
cart:{cartId}               → JSON (guest cart, TTL: 24h)
session:{sessionId}           → JSON (session data)
rate_limit:{identifier}       → Counter (rate limiting)
```

### Cache Strategy

#### Product Cache
```typescript
// Get product (cache-first)
productCache.get(productId)
  → if cached, return
  → else fetch from DB
  → set cache
  → return product

// Invalidate on update
productCache.invalidate(productId)
productListCache.invalidate()
```

#### Guest Cart Cache
```typescript
// Store as JSON in Redis
{
  "items": [
    { "id": "prod1", "quantity": 2 },
    { "id": "prod2", "quantity": 1 }
  ]
}
```

#### Rate Limiting
```typescript
// Sliding window counter
rateLimiter.check(identifier, {
  maxRequests: 10,
  window: 60  // 60 seconds
})
```

## 5. API Architecture

### REST API Endpoints

#### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
```

#### Products
```
GET    /api/products          - List products (with category filter)
POST   /api/products          - Create product (admin)
GET    /api/products/[id]     - Get product details
PUT    /api/products/[id]     - Update product
DELETE /api/products/[id]     - Delete product (soft)
```

#### Cart
```
GET    /api/cart             - Get cart
POST   /api/cart             - Add item to cart
PUT    /api/cart             - Update item quantity
DELETE /api/cart?productId=X  - Remove item
DELETE /api/cart             - Clear cart
```

#### Checkout & Payments
```
POST   /api/checkout/create-session  - Create Stripe session
POST   /api/checkout/webhook         - Stripe webhook handler
```

#### Orders
```
GET    /api/orders            - List user orders
GET    /api/orders/[id]       - Get order details
```

### API Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 6. Shopping Cart Flow

### Guest User Flow
```
1. User adds item → Generate cartId (UUID)
2. Store cartId in HTTP-only cookie
3. Store cart data in Redis: cart:{cartId}
4. On checkout → Create order with temporary userId
```

### Logged-in User Flow
```
1. User adds item → Store in DB with userId
2. Cart persists across sessions
3. On checkout → Create order with userId
4. Clear DB cart after successful order
```

### Guest to User Migration (Future Enhancement)
```
On login:
1. Check for guest cart in Redis
2. If exists, merge with user cart in DB
3. Clear Redis cart
4. Remove cartId cookie
```

## 7. Payment Integration (Stripe)

### Stripe Checkout Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ API Server   │────▶│  Stripe  │────▶│  User    │
│          │     │              │     │  Checkout │     │ Payment  │
└──────────┘     └──────┬───────┘     └─────┬────┘     └─────┬────┘
                        │                   │                  │
                        │                   ▼                  │
                        │            ┌──────────────┐       │
                        │            │   Stripe     │       │
                        │            │   Webhook    │◀──────┘
                        │            │  (backend)   │
                        │            └──────┬───────┘
                        │                   │
                        └───────────────────┘
```

### Webhook Processing

```typescript
checkout.session.completed:
  1. Verify webhook signature
  2. Extract metadata (userId, addresses)
  3. Retrieve session line items
  4. Create order in database
  5. Update product inventory
  6. Clear user cart
  7. Invalidate product cache
```

### Security Measures

1. **Webhook Signature**: All webhook events verified with Stripe secret
2. **Metadata Validation**: Session metadata includes user info
3. **Idempotency**: Orders tracked by `stripePaymentId`
4. **Inventory Lock**: Stock checked at checkout and deducted in webhook

## 8. Order State Machine

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ PROCESSING   │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       ┌─────────────┐       ┌─────────────┐
       │  SHIPPED    │       │ CANCELLED   │
       └──────┬──────┘       └─────────────┘
              │
              ▼
       ┌─────────────┐
       │  DELIVERED  │
       └─────────────┘
```

## 9. Security Architecture

### Authentication
- **JWT Tokens**: Stored in HTTP-only cookies
- **Password Hashing**: bcrypt with salt rounds = 10
- **Token Expiry**: 7 days default
- **CSRF Protection**: SameSite cookie attribute

### Authorization
```typescript
// Route protection
const user = await getCurrentUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Input Validation
- Zod schemas for request validation
- Prisma parameterized queries (SQL injection protection)
- Content-Type validation

### Rate Limiting
```typescript
// API level rate limiting
const allowed = await rateLimiter.check(ipAddress, {
  maxRequests: 100,
  window: 60  // per minute
})
```

## 10. Performance Optimization

### Caching Strategy
1. **Read-Through Cache**: Check cache → fetch DB → update cache
2. **Write-Through Cache**: Update DB → invalidate cache
3. **Cache Warming**: Seed script populates product cache

### Database Optimization
```prisma
// Indexes for common queries
@@index([category])
@@index([isActive])
@@index([userId])
@@index([status])
```

### Frontend Optimization
- **Static Generation**: Product pages (future)
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: React.lazy for admin components

## 11. Error Handling

### Error Categories
1. **Validation Errors**: 400 Bad Request
2. **Authentication Errors**: 401 Unauthorized
3. **Authorization Errors**: 403 Forbidden
4. **Not Found Errors**: 404 Not Found
5. **Server Errors**: 500 Internal Server Error

### Error Response Format
```typescript
{
  "error": "User-friendly message",
  "code": "ERROR_CODE",
  "details": {}  // Additional debug info in dev
}
```

## 12. Monitoring & Logging

### Application Logging
```typescript
console.log('Webhook received:', event.type)  // Info
console.error('Failed to process order:', error)  // Error
```

### Future Enhancements
- Structured logging (e.g., Winston)
- Error tracking (e.g., Sentry)
- Performance monitoring (e.g., Datadog)
- Database query logging in dev mode

## 13. Deployment Considerations

### Environment Variables
- Separate configs for dev/staging/production
- Never commit secrets to git
- Use .env.example as template

### Production Checklist
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure proper CORS
- [ ] Set up CDN for static assets
- [ ] Enable database backups
- [ ] Configure Redis persistence
- [ ] Set up Stripe webhooks in production
- [ ] Configure rate limiting
- [ ] Enable monitoring
- [ ] Set up log aggregation

### Scaling Strategy
1. **Horizontal Scaling**: Stateless API servers
2. **Database**: Read replicas for queries
3. **Cache**: Redis Cluster for high availability
4. **CDN**: Next.js static assets
5. **Queue**: Background job processing (future)

## 14. Future Enhancements

### Planned Features
- [ ] Product search with Elasticsearch
- [ ] Advanced filters and sorting
- [ ] Wishlist functionality
- [ ] Product reviews with images
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Multi-currency support
- [ ] Multiple payment gateways
- [ ] Admin analytics dashboard
- [ ] Inventory low-stock alerts
- [ ] Tax calculation integration
- [ ] Shipping provider integration
- [ ] Discount codes and coupons
- [ ] Customer support chat
