import { Response, Request } from 'express';
import prisma from '../../utils/Database';
import { Client } from '@prisma/client';

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

export const findOneClient = async (req: Request, res: Response) => {
  try {
    const clientId = Number(req.params.id);
    const userId = Number(req.body.id);

    if (!clientId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: Number(clientId),
        users: {
          some: {
            id: Number(userId)
          }
        }
      },
      include: {
        cases: {
          where: {
            users: {
              some: {
                id: Number(userId)
              }
            }
          },
          select: {
            id: true,
            lawBranch: true,
            lawMatter: true,
            status: true,
            users: {
              select: {
                id: true,
                name: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    console.log(client);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
}

export const updateClient = async (req: Request, res: Response) => {
  const { clientId, name, status, lastName, dni, email, phone } = req.body;


  if (!clientId || !name || status === "undefined" || !lastName || !dni || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Datos incompletos'
    });
  }

  try {
    await prisma.client.update({
      where: {
        id: Number(clientId)
      },
      data: {
        name,
        status: status,
        lastName,
        dni,
        email,
        phone,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Cliente actualizado correctamente',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el cliente'
    });
  }
}