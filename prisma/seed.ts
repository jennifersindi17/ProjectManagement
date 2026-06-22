import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@projectflow.com' },
    update: {},
    create: {
      email: 'admin@projectflow.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.SUPER_ADMIN,
      phone: '+62 812 3456 7890',
      department: 'IT',
    },
  })

  // Create team members
  const members = [
    { email: 'budi@projectflow.com', name: 'Budi Santoso', role: Role.PROJECT_MANAGER, password: 'password123' },
    { email: 'siti@projectflow.com', name: 'Siti Rahayu', role: Role.TEAM_LEAD, password: 'password123' },
    { email: 'ahmad@projectflow.com', name: 'Ahmad Wijaya', role: Role.DEVELOPER, password: 'password123' },
    { email: 'dewi@projectflow.com', name: 'Dewi Lestari', role: Role.QA, password: 'password123' },
    { email: 'agus@projectflow.com', name: 'Agus Pratama', role: Role.DEVELOPER, password: 'password123' },
    { email: 'rina@projectflow.com', name: 'Rina Susanti', role: Role.DEVELOPER, password: 'password123' },
    { email: 'eko@projectflow.com', name: 'Eko Prasetyo', role: Role.DEVELOPER, password: 'password123' },
    { email: 'maya@projectflow.com', name: 'Maya Anggraini', role: Role.TEAM_LEAD, password: 'password123' },
  ]

  for (const m of members) {
    const pw = await hashPassword(m.password)
    await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: { ...m, password: pw },
    })
  }

  console.log('✅ Seed completed!')
  console.log('Admin: admin@projectflow.com / admin123')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
