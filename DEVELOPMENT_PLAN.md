# Shopmax 电商平台开发方案

## 一、项目技术栈概览

| 层级 | 技术选型 |
|------|----------|
| 框架 | Next.js 14.2.13 (App Router) |
| 语言 | TypeScript |
| 数据库 | PostgreSQL + Prisma ORM |
| 缓存 | Redis (ioredis) |
| 支付 | Stripe |
| UI | TailwindCSS + Radix UI |
| 表单验证 | Zod |

**项目当前状态**：
- ✅ 基础架构就绪 (Next.js + Prisma + PostgreSQL + Redis)
- ✅ 用户认证系统 (JWT)
- ✅ 产品管理 CRUD
- ✅ 购物车 API
- ✅ 订单系统 + Stripe 支付集成
- ⏳ 待完善：购物车页面、搜索、评价、地址管理等

---

## 二、需求分析与依赖关系

### 核心依赖关系图

```
P0 高优先级（核心购买流程）:

┌─────────────────────────────────────────────────────────────┐
│                    购物车页面 (P0-1)                         │
│  - 依赖: 已有 Cart API (/api/cart)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    产品搜索 (P0-3~P0-5)                      │
│  - 后端 API: /api/products/search                           │
│  - 前端: 搜索框 + 搜索结果页                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    地址管理 (P0-8~P0-9)                      │
│  - 基于现有 Address 模型完善 CRUD                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    产品评价 (P0-6~P0-7)                      │
│  - 依赖: 已有 Review 模型                                    │
│  - 需新增: 评价提交 API                                      │
└─────────────────────────────────────────────────────────────┘
```

**关键发现**：
- 购物车 API 已实现 (`/api/cart`)，只需完善前端页面
- Review 模型已存在，API 需新增评价提交端点
- Address 模型已存在，API 需完善 CRUD

---

## 三、分阶段开发计划

### 第一阶段：核心购买流程（P0）| 预计 2 周

#### 1.1 购物车页面（购物车 → 结算 → 支付）

| 任务 | 开发目标 | 技术要点 |
|------|----------|----------|
| `/cart` 页面 | 展示购物车商品列表 | 使用 `useQuery` 缓存购物车数据 |
| 数量修改 | 支持 +/- 按钮修改数量 | 乐观更新 (Optimistic Update) |
| 删除商品 | 单个删除 + 批量清空 | 确认对话框防止误删 |
| 金额汇总 | 小计、运费、总计计算 | 运费阈值逻辑 (满免运) |
| 空状态 | 空购物车引导页 | 引导至产品页 |

**开发文件**：
- 前端：`app/cart/page.tsx`
- 组件：`components/CartItem.tsx`、`components/CartSummary.tsx`

**开发风险规避**：
- 库存不足时实时提示
- 防止超卖（提交订单前再次校验库存）

`★ Insight ─────────────────────────────────────`
购物车前端基于现有 CartItem 模型构建，利用 Next.js App Router 的服务端组件加载初始数据，客户端通过 React Query 管理交互状态。乐观更新可提升用户体验，但需处理并发冲突。
`─────────────────────────────────────────────────`

#### 1.2 产品搜索功能

| 任务 | 详细说明 |
|------|----------|
| 后端 API | `GET /api/products/search?q=xxx&minPrice=...&maxPrice=...&sort=price_asc` |
| 前端搜索框 | Header 集成搜索入口，支持回车搜索 |
| 搜索结果页 | `/search` 页面，分页 + 筛选面板 |

**搜索实现思路**：

| 方案 | 描述 | 适用场景 |
|------|------|----------|
| 方案 A: LIKE 查询 | 简单实现，PostgreSQL 全文搜索 | 小规模数据 (<10万条)，快速上线 |
| 方案 B: Elasticsearch | 高级分词、权重排序、聚合 facets | 大规模数据 + 复杂筛选（TODO 未来功能） |

推荐先采用方案 A，满足当前需求后预留 Elasticsearch 扩展接口。

**开发文件**：
- 后端：`app/api/products/search/route.ts`
- 前端：`app/search/page.tsx`
- 组件：`components/SearchFilters.tsx`、`components/ProductGrid.tsx`

#### 1.3 产品评价展示

| 任务 | 技术实现 |
|------|----------|
| 评价展示区域 | 产品详情页添加评价组件 |
| 平均评分 | 聚合查询 `AVG(rating)` |
| 评价列表 | 分页加载，避免一次加载过多 |
| 提交评价 API | `POST /api/products/[id]/reviews` |

**权限控制**：仅已购买用户可评价（通过 Order 表校验）

**开发文件**：
- 后端：`app/api/products/[id]/reviews/route.ts`
- 组件：`components/Reviews.tsx`、`components/ReviewForm.tsx`

#### 1.4 地址管理

API 设计（基于现有 Address 模型）：

```
GET    /api/addresses              → 获取用户地址列表
POST   /api/addresses              → 添加新地址
PUT    /api/addresses/[id]         → 更新地址
DELETE /api/addresses/[id]         → 删除地址
PUT    /api/addresses/[id]/default → 设为默认
```

**前端页面**：`/account/addresses`

**开发文件**：
- 后端：`app/api/addresses/route.ts`、`app/api/addresses/[id]/route.ts`
- 前端：`app/account/addresses/page.tsx`
- 组件：`components/AddressForm.tsx`、`components/AddressList.tsx`

---

### 第二阶段：增强功能（P1）| 预计 2 周

#### 2.1 愿望清单 (Wishlist)

**数据库设计**：

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String?  // 匿名用户为 null
  sessionId String?  // 匿名用户用 sessionId
  productId String
  createdAt DateTime @default(now())

  product   Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
  @@unique([sessionId, productId])
}
```

**API 端点**：
```
GET    /api/wishlist        → 获取愿望清单
POST   /api/wishlist        → 添加商品
DELETE /api/wishlist?productId=xxx → 移除商品
```

**匿名 → 登录同步逻辑**：
1. 匿名用户将 wishlist 存 Redis (sessionId → [productIds])
2. 用户登录时查询 Redis，合并到用户 Wishlist 表

#### 2.2 管理员 Analytics 仪表板

| 功能 | 数据来源 | 实现方式 |
|------|----------|----------|
| 销售统计 | Order 表聚合 | Prisma aggregate |
| 订单趋势 | 按日期分组统计 | GROUP BY date |
| 热门产品 | OrderItem 按数量排序 | 聚合统计 |
| 低库存告警 | Product.stock < 阈值 | 定时任务或实时检查 |

**前端页面**：`/admin/analytics`

**推荐图表库**：Recharts（轻量、React 原生）

#### 2.3 邮件通知

推荐集成 **Resend**（比 SendGrid 更现代，API 友好）：

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(email: string, order: Order) {
  return resend.emails.send({
    from: 'Shopmax <noreply@shopmax.com>',
    to: email,
    subject: 'Order Confirmation',
    html: `<h1>Order #${order.id} confirmed</h1>...`
  });
}
```

| 邮件类型 | 触发时机 |
|----------|----------|
| 订单确认 | 支付成功后 |
| 订单发货 | 物流单号生成后 |
| 密码重置 | 用户请求重置时 |

#### 2.4 折扣码系统

**数据库设计**：

```prisma
model Coupon {
  id              String     @id @default(cuid())
  code            String     @unique
  description     String?
  discountType    DiscountType
  discountValue   Decimal    @db.Decimal(10, 2)
  minOrderAmount  Decimal?   @db.Decimal(10, 2)
  expiresAt       DateTime?
  usageLimit      Int?       // 最高使用次数
  usedCount       Int        @default(0)
  isActive        Boolean    @default(true)
  createdAt       DateTime   @default(now())
}

enum DiscountType {
  FIXED       // 固定金额
  PERCENTAGE // 百分比
}
```

**API 端点**：
```
POST /api/coupons/validate  → 验证折扣码并返回优惠金额
```

**结算页应用**：
1. 用户输入折扣码
2. 调用 validate API
3. 返回折扣金额，更新订单总价
4. 提交订单时二次验证

#### 2.5 错误处理优化

| 页面 | 路径 | 说明 |
|------|------|------|
| 404 | `app/not-found.tsx` | 资源不存在 |
| 500 | `app/error.tsx` | 服务器错误 |

**全局错误边界**：使用 React Error Boundary 捕获组件树错误

---

### 第三阶段：体验优化（P2）| 预计 1 周

#### 3.1 移动端导航

- 汉堡菜单使用 Radix UI Dialog
- 侧边栏使用 Radix UI Sheet
- 响应式断点：mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

#### 3.2 Loading 状态

| 类型 | 实现方式 |
|------|----------|
| 页面加载 | Next.js `loading.tsx` 骨架屏 |
| 数据请求 | React `useTransition` |
| 按钮状态 | 禁用 + Spinner |

#### 3.3 图片优化

```tsx
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL={product.blurHash}
/>
```

---

## 四、详细任务拆分表

### P0 高优先级

| ID | 任务 | 前端文件 | 后端文件 | 预估工时 | 依赖 |
|----|------|----------|----------|----------|------|
| P0-1 | 购物车页面 | `app/cart/page.tsx` | 已有 API | 4h | Cart API |
| P0-2 | 数量修改功能 | `components/CartItem.tsx` | 已有 | 2h | P0-1 |
| P0-3 | 搜索 API | - | `app/api/products/search/route.ts` | 3h | - |
| P0-4 | 搜索框组件 | `components/Header.tsx` | - | 2h | P0-3 |
| P0-5 | 搜索结果页 | `app/search/page.tsx` | - | 4h | P0-3, P0-4 |
| P0-6 | 评价展示 | `components/Reviews.tsx` | - | 3h | Review 模型 |
| P0-7 | 提交评价 API | - | `app/api/products/[id]/reviews/route.ts` | 3h | P0-6 |
| P0-8 | 地址管理 API | - | `app/api/addresses/**` | 4h | Address 模型 |
| P0-9 | 地址管理页面 | `app/account/addresses/page.tsx` | - | 4h | P0-8 |

**P0 阶段总计**：29 小时（≈ 1.5 周）

### P1 中优先级

| ID | 任务 | 预估工时 | 依赖 |
|----|------|----------|------|
| P1-1 | Wishlist 前后端 | 6h | P0 阶段完成 |
| P1-2 | Analytics 仪表板 | 8h | P0 阶段完成 |
| P1-3 | 邮件通知集成 | 4h | 订单模块 |
| P1-4 | 折扣码系统 | 6h | 订单模块 |
| P1-5 | 错误页面 (404/500) | 2h | - |

**P1 阶段总计**：26 小时（≈ 1 周）

### P2 低优先级

| ID | 任务 | 预估工时 | 依赖 |
|----|------|----------|------|
| P2-1 | 移动端导航 | 4h | P0 阶段完成 |
| P2-2 | Loading 状态 | 3h | - |
| P2-3 | 图片优化 | 2h | - |

**P2 阶段总计**：9 小时（≈ 0.5 周）

---

## 五、测试方案

### 5.1 单元测试 (Vitest)

```
目录结构:
├── __tests__/
│   ├── lib/
│   │   ├── email.test.ts
│   │   └── coupon.test.ts
│   └── utils/
│       └── price.test.ts
```

**测试用例示例**：

```typescript
// __tests__/lib/coupon.test.ts
import { validateCoupon } from '@/lib/coupon';

describe('validateCoupon', () => {
  it('should apply fixed discount', () => {
    const result = validateCoupon('SAVE10', 100); // 10% off
    expect(result.discount).toBe(10);
  });

  it('should reject expired coupon', () => {
    await expect(validateCoupon('EXPIRED', 100))
      .rejects.toThrow('Coupon expired');
  });
});
```

### 5.2 E2E 测试 (Playwright)

关键流程测试用例：

| 流程 | 测试步骤 | 预期结果 |
|------|----------|----------|
| 完整购物流程 | 登录 → 浏览 → 加购 → 结算 → 支付 | 订单创建成功 |
| 搜索流程 | 输入关键词 → 筛选 → 点击结果 | 正确跳转到产品页 |
| 评价流程 | 购买后 → 提交评价 → 显示 | 评价成功展示 |

### 5.3 测试覆盖率目标

| 类型 | 目标覆盖率 |
|------|------------|
| 核心业务逻辑 | > 80% |
| API 端点 | > 70% |
| 关键用户流程 | 100% 通过 |

---

## 六、部署流程

### 6.1 环境配置

| 环境 | 配置 | 用途 |
|------|------|------|
| 开发 | localhost:3000 | 本地开发调试 |
| 预览 | Vercel Preview | PR 预览部署 |
| 生产 | Vercel / AWS | 正式环境 |

**本地开发栈**（Docker Compose）：
- PostgreSQL: 数据库
- Redis: 缓存 + Session

### 6.2 CI/CD 流程

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

### 6.3 数据库迁移

```bash
# 开发环境
npm run db:push

# 生产环境（先备份！）
npx prisma migrate deploy
```

**重要**：生产环境迁移前务必备份数据库！

---

## 七、后期维护注意事项

### 7.1 性能监控

| 工具 | 用途 |
|------|------|
| Vercel Analytics | Core Web Vitals 监控 |
| Sentry | 前端错误追踪 |
| Prisma Studio | 数据库查询分析 |

**性能指标目标**：
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### 7.2 安全检查清单

| 项目 | 状态 | 说明 |
|------|------|------|
| 密码加密 | ✅ | bcrypt |
| JWT 认证 | ✅ | HttpOnly Cookie |
| API 速率限制 | ⏳ | TODO 技术债务 |
| 环境变量验证 | ⏳ | TODO 技术债务 |
| SQL 注入防护 | ✅ | Prisma 参数化查询 |
| XSS 防护 | ✅ | React 默认转义 |

### 7.3 扩展性路线图

| 阶段 | 扩展方案 | 触发条件 |
|------|----------|----------|
| 用户量增长 | Prisma Accelerator (缓存) | 查询延迟 > 200ms |
| 图片存储 | 迁移至 S3/Cloudflare R2 | 图片数量 > 10万 |
| 搜索需求 | 引入 Elasticsearch | LIKE 查询无法满足 |

---

## 八、推荐开发顺序

`★ Insight ─────────────────────────────────────`
项目数据库模型已完备，购物车页面是 ROI 最高的任务——后端 API 已就绪，仅需前端开发。建议以此为切入点，可快速产出可用功能建立迭代信心。
`─────────────────────────────────────────────────`

### 立即可执行

| 顺序 | 任务 | 预估工时 | 理由 |
|------|------|----------|------|
| 1 | P0-1 购物车页面 | 4h | 后端已就绪，快速产出 |
| 2 | P0-2 数量修改 | 2h | 购物车交互核心 |
| 3 | P0-3~P0-5 产品搜索 | 9h | 核心用户体验 |
| 4 | P0-6~P0-7 评价功能 | 6h | 增强信任感 |
| 5 | P0-8~P0-9 地址管理 | 8h | 完善结算流程 |

### 阶段目标

| 阶段 | 完成标志 | 预期成果 |
|------|----------|----------|
| 第一阶段 | 购物车 + 搜索 + 评价 + 地址 | 完整购买闭环 |
| 第二阶段 | Wishlist + Analytics + 邮件 + 折扣码 | 增强功能 |
| 第三阶段 | 移动端优化 + 加载体验 | 优质体验 |

---

## 九、技术债务

| 任务 | 优先级 | 说明 |
|------|--------|------|
| TypeScript 严格模式 | 中 | 提升代码质量 |
| 单元测试 | 高 | 保障重构安全 |
| E2E 测试 | 高 | 关键流程验证 |
| API 文档 | 中 | OpenAPI/Swagger |
| 环境变量验证 | 中 | Zod schema 验证 |
| 请求速率限制 | 低 | 防滥用 |

---

*文档最后更新：2026-04-02*
*基于 TODO.md 生成*