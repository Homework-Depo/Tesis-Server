import { PrismaClient } from '@prisma/client'
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient()
async function main() {

  const salt = await genSalt(10);

  const user = await prisma.user.create({
    data: {
      name: 'Javier Pablo',
      lastName: 'Aponte Cáceres',
      email: "javier.aponte@estudioaponte.com",
      password: await hash("123456", salt),
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alfonso Constantino",
      lastName: "Spínola Ramos",
      email: "alfonso.spinola@estudioaponte.com",
      password: await hash("123456", salt)
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
        // connect to multiple users at once
        connect: [
          { id: user.id },
          { id: user2.id }
        ],
        //
      }
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Miguel Antonio",
      lastName: "Guerrero Aguilar",
      email: "miguel.antonio@gmail.com",
      dni: "75699815",
      phone: "954122369",
      status: false,
      users: {
        // connect to multiple users at once
        connect: [
          { id: user.id },
          { id: user2.id }
        ],
        //
      }
    }
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Maria Alejandra",
      lastName: "Aguero Paredes",
      email: "maria.paredes@gmail.com",
      dni: "75601815",
      phone: "934120369",
      status: true,
      users: {
        // connect to multiple users at once
        connect: [
          { id: user.id }
        ],
        //
      }
    }
  });

  console.log({ user });
  console.log({ user2 });
  console.log({ client })
  console.log({ client2 });
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