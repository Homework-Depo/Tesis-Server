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

  const branchSantaAnita = await prisma.officeBranch.create({
    data: {
      name: "Santa Anita #1",
      address: "Av. Los Eucaliptos 123",
      phone: "934120369"
    }
  });

  const branchAte1 = await prisma.officeBranch.create({
    data: {
      name: "Ate #1",
      address: "Av. Los Eucaliptos 123",
      phone: "934120369"
    }
  });

  const branchAte2 = await prisma.officeBranch.create({
    data: {
      name: "Ate #2",
      address: "Av. Los Eucaliptos 123",
      phone: "934120369"
    }
  });

  // Law Branchs - Start
  const civilBranch = await prisma.lawBranch.create({
    data: {
      name: "Civil"
    }
  });

  const penalBrach = await prisma.lawBranch.create({
    data: {
      name: "Penal"
    }
  });
  // Law Branchs - End

  // Law Matter - Civil - Start
  const civilMatter1 = await prisma.lawMatter.create({
    data: {
      name: "Desalojo",
      lawBranch: {
        connect: {
          id: civilBranch.id
        }
      }
    }
  });

  const civilMatter2 = await prisma.lawMatter.create({
    data: {
      name: "Obligación de dar Suma de Dinero",
      lawBranch: {
        connect: {
          id: civilBranch.id
        }
      }
    }
  });

  const civilMatter3 = await prisma.lawMatter.create({
    data: {
      name: "Otorgamiento de Escritura",
      lawBranch: {
        connect: {
          id: civilBranch.id
        }
      }
    }
  });

  const civilMatter4 = await prisma.lawMatter.create({
    data: {
      name: "Resolución de Contrato",
      lawBranch: {
        connect: {
          id: civilBranch.id
        }
      }
    }
  });

  const civilMatter5 = await prisma.lawMatter.create({
    data: {
      name: "Reivinidicación",
      lawBranch: {
        connect: {
          id: civilBranch.id
        }
      }
    }
  });

  // Law Matter - Civil - End

  // Law Matter - Penal - Start
  const penalMatter1 = await prisma.lawMatter.create({
    data: {
      name: "Homicidio",
      lawBranch: {
        connect: {
          id: penalBrach.id
        }
      }
    }
  });

  const penalMatter2 = await prisma.lawMatter.create({
    data: {
      name: "Hurto",
      lawBranch: {
        connect: {
          id: penalBrach.id
        }
      }
    }
  });

  const penalMatter3 = await prisma.lawMatter.create({
    data: {
      name: "Usurpación Agravada",
      lawBranch: {
        connect: {
          id: penalBrach.id
        }
      }
    }
  });

  const penalMatter4 = await prisma.lawMatter.create({
    data: {
      name: "Estafa",
      lawBranch: {
        connect: {
          id: penalBrach.id
        }
      }
    }
  });

  const penalMatter5 = await prisma.lawMatter.create({
    data: {
      name: "Delito Contra la Libertad Sexual",
      lawBranch: {
        connect: {
          id: penalBrach.id
        }
      }
    }
  });

  // Law Matter - Penal - End

  console.log({ user });
  console.log({ user2 });
  console.log({ client })
  console.log({ client2 });
  console.log({ branchSantaAnita });
  console.log({ branchAte1 });
  console.log({ branchAte2 });
  console.log({ civilBranch });
  console.log({ penalBrach });
  console.log({ civilMatter1 });
  console.log({ civilMatter2 });
  console.log({ civilMatter3 });
  console.log({ civilMatter4 });
  console.log({ civilMatter5 });
  console.log({ penalMatter1 });
  console.log({ penalMatter2 });
  console.log({ penalMatter3 });
  console.log({ penalMatter4 });
  console.log({ penalMatter5 });
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