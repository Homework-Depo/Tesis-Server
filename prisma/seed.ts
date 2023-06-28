import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Javier Pablo',
      lastName: 'Aponte Cáceres',
      email: "javier.aponte@estudioaponte.com",
      password: "123456",
      secretKey: "TqfvPwUMbitCUmi"
    }
  });

  const client = await prisma.client.create({
    data: {
      name: "Enrique Augusto",
      lastName: "Ramos Castilla",
      email: "enrique.ramos@gmail.com",
      dni: "75699829",
      phone: "951123269",
      users: {
        connect: {
          id: user.id
        }
      }
    }
  });

  console.log({ user })
  console.log({ client })
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