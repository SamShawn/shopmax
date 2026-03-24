import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据填充...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  console.log('✓ 创建用户:', user.email)

  // 创建默认地址
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      fullName: 'Demo User',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
      phone: '+1234567890',
      isDefault: true,
    },
  })

  console.log('✓ 创建地址:', address.street)

  // 创建产品分类
  const products = [
    {
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      price: 299.00,
      stock: 50,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery.',
      price: 449.00,
      stock: 30,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB mechanical keyboard with custom switches and programmable keys.',
      price: 159.00,
      stock: 100,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4d04?w=500',
    },
    {
      name: 'Leather Backpack',
      description: 'Premium genuine leather backpack with laptop compartment and multiple pockets.',
      price: 189.00,
      stock: 40,
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    },
    {
      name: 'Running Shoes Elite',
      description: 'Lightweight running shoes with advanced cushioning and breathable mesh.',
      price: 149.00,
      stock: 75,
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    },
    {
      name: 'Coffee Maker Deluxe',
      description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
      price: 249.00,
      stock: 25,
      category: 'Home',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f75a9f?w=500',
    },
    {
      name: 'Desk Lamp LED',
      description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
      price: 79.00,
      stock: 80,
      category: 'Home',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    },
    {
      name: 'Wireless Earbuds',
      description: 'Compact wireless earbuds with superior sound quality and active noise cancellation.',
      price: 179.00,
      stock: 60,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
    console.log(`✓ 创建产品: ${product.name}`)
  }

  console.log('种子数据填充完成!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
