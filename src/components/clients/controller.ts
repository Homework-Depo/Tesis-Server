import { Response, Request } from 'express';
import prisma from '../../utils/Database';

export const create = async (req: Request, res: Response) => {
  const { id, name, lastName, dni, email, phone } = req.body;
  console.log(id, name, lastName, dni, email, phone);

  if (!name || !lastName || !dni || !email || !phone) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    await prisma.client.create({
      data: {
        name,
        lastName,
        dni,
        email,
        phone,
        users: {
          connect: {
            id: id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            lastName: true,
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente' });
  }

  res.status(200).json({
    success: true,
    message: 'Cliente creado correctamente',
  });
}

export const findAllClients = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    /* const data = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        clients: true
      }
    }); */

    const data = await prisma.client.findMany({
      where: {
        users: {
          some: {
            id: id
          }
        }
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        status: true,
        users: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno al obtener los clientes.'
    });
  }
}