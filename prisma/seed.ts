import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Example with upsert
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  })
  console.log(user)
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
