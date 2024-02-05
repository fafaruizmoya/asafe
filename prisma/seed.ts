import { PrismaClient } from '@prisma/client'
import crypto from "crypto"

const prisma = new PrismaClient()
async function main() {
  const salt = crypto.randomBytes(16).toString("hex")

  const password = crypto
    .pbkdf2Sync('Admin_1234', salt, 1000, 64, "sha512")
    .toString("hex")

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      firstName: 'Admin',
      lastName: 'Test',
      role: 'ADMIN',
      salt,
      password
    },
  })
  console.log({ admin })

  const saltU = crypto.randomBytes(16).toString("hex")

  const passwordU = crypto
    .pbkdf2Sync('Test_12345', saltU, 1000, 64, "sha512")
    .toString("hex")

  const user = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      email: 'test1@example.com',
      firstName: 'Test',
      lastName: 'Test',
      role: 'USER',
      salt: saltU,
      password: passwordU
    },
  })
  console.log({ user })
  return 
}
main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })