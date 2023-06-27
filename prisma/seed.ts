import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Javier Aponte',
      email: "javier.aponte@estudioaponte.com",
      password: "123456",
      secretKey: "TqfvPwUMbitCUmi"
    }
  })

  console.log({ user })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })