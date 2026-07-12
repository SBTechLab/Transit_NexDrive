import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('pass123', 10)
  const result = await prisma.user.updateMany({ data: { passwordHash: hash } })
  console.log(`Updated ${result.count} users to password: pass123`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
