import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, passwordHash: true, role: true } })
  console.log(`Total users: ${users.length}`)
  for (const u of users) {
    const ok1 = await bcrypt.compare('pass123', u.passwordHash)
    const ok2 = await bcrypt.compare('password123', u.passwordHash)
    console.log(`${u.email} | ${u.role} | pass123: ${ok1} | password123: ${ok2}`)
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
