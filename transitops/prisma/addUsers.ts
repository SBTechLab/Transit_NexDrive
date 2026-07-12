import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('pass123', 10)
  const users = [
    { name: 'SB Bhalani',    email: 'sbbhalani11@gmail.com',   role: Role.FLEET_MANAGER },
    { name: 'D25 Charusat',  email: 'd25ce143@charusat.edu.in', role: Role.FLEET_MANAGER },
    { name: 'SB Pro',        email: 'sbpro1820@gmail.com',      role: Role.SAFETY_OFFICER },
    { name: 'Master Prompt', email: 'masterprompt8@gmail.com',  role: Role.FINANCIAL_ANALYST },
    { name: 'Smart Max',     email: 'smartmax650@gmail.com',    role: Role.DRIVER },
  ]
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hash },
      create: { name: u.name, email: u.email, passwordHash: hash, role: u.role },
    })
    console.log('Done:', u.email, '|', u.role)
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
