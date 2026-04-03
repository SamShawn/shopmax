# Shopmax 项目待办清单

## 概述

本文档列出了 Shopmax 电商平台需要完善的所有功能，按优先级分组。

---

## 🔴 高优先级 (P0)

### 1. 购物车页面
- [x] 创建 `/cart` 页面
- [x] 显示购物车商品列表
- [x] 支持修改商品数量
- [x] 支持删除商品
- [x] 显示订单金额汇总
- [x] 空购物车状态处理
- [x] API: `GET/POST/PUT/DELETE /api/cart` 已实现

### 2. 产品搜索功能
- [x] 创建搜索 API (`/api/products/search`)
- [ ] 添加搜索输入框到 Header
- [x] 创建 `/search` 页面
- [x] 实现按名称、描述搜索
- [x] 实现价格范围筛选
- [x] 实现排序功能（价格、创建时间）

### 3. 产品评价展示
- [x] 在产品详情页添加评价区域
- [x] 显示平均评分和评价数量
- [x] 列出用户评价列表
- [x] 创建评价 API (`POST /api/products/[id]/reviews`)
- [ ] 仅已购买用户可评价

### 4. 地址管理
- [x] 创建地址管理 API
  - [x] `GET /api/addresses` - 获取用户地址
  - [x] `POST /api/addresses` - 添加地址
  - [x] `PUT /api/addresses/[id]` - 更新地址
  - [x] `DELETE /api/addresses/[id]` - 删除地址
  - [x] `PUT /api/addresses/[id]/default` - 设为默认
- [x] 创建地址管理页面 `/account/addresses`
- [ ] 结算页选择收货地址

---

## 🟡 中优先级 (P1)

### 5. 愿望清单 (Wishlist)
- [ ] 创建 wishlist 数据库表
- [ ] API 端点
  - [ ] `GET /api/wishlist` - 获取愿望清单
  - [ ] `POST /api/wishlist` - 添加商品
  - [ ] `DELETE /api/wishlist?productId=` - 移除商品
- [ ] 产品卡片添加心愿按钮
- [ ] 创建 `/wishlist` 页面
- [ ] 登录后同步 Redis 匿名 wishlist

### 6. 管理员 Analytics 仪表板
- [ ] 创建 `/admin/analytics` 页面
- [ ] 销售数据统计
  - [ ] 今日/本周/本月销售额
  - [ ] 订单数量趋势图
- [ ] 热门产品排行
- [ ] 新用户统计
- [ ] 低库存产品告警列表

### 7. 邮件通知
- [ ] 集成邮件服务 (SendGrid / Resend / Nodemailer)
- [ ] 订单确认邮件
- [ ] 订单发货通知
- [ ] 密码重置邮件

### 8. 折扣码/优惠券系统
- [ ] 创建 Coupon 数据库模型
- [ ] API 端点
  - [ ] `POST /api/coupons/validate` - 验证折扣码
- [ ] 结算页应用折扣码
- [ ] 管理员创建/管理优惠券

### 9. 错误处理优化
- [x] 创建 `/404` 页面 (Next.js 默认)
- [x] 创建 `/500` 页面 (Next.js 默认)
- [ ] 全局错误边界 (Error Boundary)
- [x] API 错误响应统一格式

---

## 🟢 低优先级 (P2)

### 10. 移动端导航优化
- [x] Header 移动端响应式菜单
- [x] 移动端汉堡菜单
- [x] 侧边栏导航

### 11. Loading 状态
- [ ] 添加 Next.js loading.js
- [ ] 产品列表骨架屏
- [ ] 按钮 loading 状态
- [ ] 表单提交 loading

### 12. 图片优化
- [ ] 产品图片使用 Next.js `<Image>` 组件
- [ ] 添加图片懒加载
- [ ] 添加占位符 (blur placeholder)

### 13. 库存告警
- [ ] 管理员低库存提醒
- [ ] 邮件通知管理员
- [ ] 库存阈值配置

### 14. 支付失败页面
- [ ] 完善 `/checkout/cancel` 页面
- [ ] 显示失败原因
- [ ] 提供重新支付入口

### 15. 产品详情页增强
- [ ] 产品图片画廊 (多图)
- [ ] 规格选择 (尺寸、颜色)
- [ ] 相关产品推荐
- [ ] 最近浏览记录

### 16. 用户账户页面
- [ ] `/account` 页面
- [ ] 个人信息编辑
- [ ] 密码修改
- [ ] 账户设置

### 17. 订单详情页
- [ ] 显示订单物流状态
- [ ] 订单项详细信息
- [ ] 发票下载

---

## 📋 技术债务

- [ ] 添加 TypeScript 严格模式
- [ ] 添加单元测试 (Jest / Vitest)
- [ ] 添加 E2E 测试 (Playwright)
- [ ] 添加 API 文档 (OpenAPI/Swagger)
- [ ] 环境变量验证 (zod)
- [ ] 请求速率限制 (rate limiting) 完善

---

## 🎨 UI/UX 改进

- [ ] 暗色模式支持
- [ ] 动画效果增强
- [ ]  Toast 通知组件优化
- [ ] 表单验证 UI 改进
- [ ] 键盘导航支持
- [ ] 国际化 (i18n) 准备

---

## 🚀 未来功能

- [ ] Elasticsearch 产品搜索
- [ ] 高级筛选面板
- [ ] 产品图片上传 (管理员)
- [ ] 多货币支持
- [ ] 多个支付网关
- [ ] 客服聊天集成
- [ ] SMS 通知
- [ ] 物流集成 (UPS, FedEx, etc.)
- [ ] 税务计算集成
- [ ] 订阅功能 (定期购买)
- [x] 社交登录 (Google, GitHub)
- [ ] 两步验证 (2FA)

---

## 任务标记说明

- [ ] 未开始
- [x] 已完成
- 🔴 高优先级
- 🟡 中优先级
- 🟢 低优先级

---

*最后更新: 2026-04-02*