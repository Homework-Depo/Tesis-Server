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