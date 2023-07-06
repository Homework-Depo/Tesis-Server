import { Request, Response } from 'express';
import { Case, Client } from "@prisma/client";
import prisma from '../../utils/Database';

export const get = async (req: Request, res: Response) => {
  const { clientId } = req.query;
  const idPresent = clientId && clientId !== undefined ? true : false;

  try {
    if (idPresent) {
      const clients = await prisma.client.findUnique({
        where: {
          id: Number(clientId)
        },
        select: {
          id: true,
          name: true,
          lastName: true
        }
      });

      if (!clients) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado"
        });
      }

      const lawMatters = await prisma.lawMatter.findMany();

      return res.status(200).json({
        success: true,
        data: [[clients], lawMatters]
      });
    }
    else {
      const clients = await prisma.client.findMany({
        select: {
          id: true,
          name: true,
          lastName: true
        }
      });

      const lawMatters = await prisma.lawMatter.findMany({
        select: {
          id: true,
          name: true,
          lawBranchId: true
        }
      });

      return res.status(200).json({
        success: true,
        data: [clients, lawMatters]
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

export const createCase = async (req: Request, res: Response) => {
  const {
    client,
    title,
    description,
    lawBranch,
    lawMatter,
    code,
    court,
    officer,
    judge,
    hasJudicialFile
  } = req.body;

  if (client || !title || !lawBranch || !lawMatter) {
    return res.status(400).json({
      success: false,
      message: "Datos Incompletos."
    });
  }

  try {
    if (!hasJudicialFile) {
      await prisma.case.create({
        data: {
          title: title,
          description: description || "",
          lawBranch: {
            connect: {
              id: Number(lawBranch)
            }
          },
          lawMatter: {
            connect: {
              id: Number(lawMatter)
            }
          },
          client: {
            connect: {
              id: Number(client)
            }
          }
        }
      });
    }

    await prisma.case.create({
      data: {
        title: title,
        description: description || "",
        lawBranch: {
          connect: {
            id: Number(lawBranch)
          }
        },
        lawMatter: {
          connect: {
            id: Number(lawMatter)
          }
        },
        client: {
          connect: {
            id: Number(client)
          }
        },
        courtFile: {
          create: {
            code: code,
            court: court,
            officer: officer,
            judge: judge
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Caso creado exitosamente.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}