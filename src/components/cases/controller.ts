import { Request, Response } from 'express';
import { Case, Client } from "@prisma/client";
import prisma from '../../utils/Database';

export const findClient = async (req: Request, res: Response) => {
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

  console.log(req.body);

  if (!client || !title || !lawBranch || !lawMatter) {
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
          },
          users: {
            connect: {
              id: Number(req.body.id)
            }
          }
        }
      });
    } else {
      await prisma.case.create({
        data: {
          title: title,
          description: description,
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
          users: {
            connect: {
              id: Number(req.body.id)
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
    }

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

export const findAllCases = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const clients = await prisma.case.findMany({
      where: {
        users: {
          some: {
            id: id
          }
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        lawBranch: {
          select: {
            name: true
          }
        },
        lawMatter: {
          select: {
            name: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        },
        users: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        },
      }
    });

    return res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}

export const findCase = async (req: Request, res: Response) => {
  const id = req.body.id;
  const caseId = req.params.id;

  try {
    const client = await prisma.case.findFirst({
      where: {
        id: Number(caseId),
        users: {
          some: {
            id: id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        },
        lawBranch: {
          select: {
            id: true,
            name: true
          }
        },
        lawMatter: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        },
        courtFile: {
          select: {
            id: true,
            code: true,
            court: true,
            officer: true,
            judge: true
          }
        }
      }
    });

    !client && res.status(404).json({
      success: false,
      message: "Caso no encontrado."
    });

    return res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}