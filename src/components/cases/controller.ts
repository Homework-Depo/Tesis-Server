import { Request, Response } from 'express';
import { Case, Client, File } from "@prisma/client";
import prisma from '../../utils/Database';
import * as aws from "../../utils/AWS";
import { GetObjectCommandOutput, GetObjectOutput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import path from 'path';

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
        files: true,
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

export const updateCase = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const {
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

  if (!title || !lawBranch || !lawMatter) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos."
    });
  }

  try {
    if (!hasJudicialFile) {
      await prisma.case.update({
        where: {
          id: Number(caseId)
        },
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
          }
        }
      });
    } else {
      await prisma.case.update({
        where: {
          id: Number(caseId)
        },
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
          courtFile: {
            update: {
              code: code,
              court: court,
              officer: officer,
              judge: judge
            }
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caso actualizado exitosamente."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}

export const uploadFiles = async (req: Request, res: Response) => {
  const { id } = req.body;
  const caseId = req.params.id;

  const files = req.files as Express.Multer.File[];
  const newFiles: File[] = [];

  if (!files || !caseId) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos."
    });
  }

  try {
    const caseFound = await prisma.case.findFirst({
      where: {
        id: Number(caseId),
        users: {
          some: {
            id: Number(id)
          }
        }
      }
    });

    !caseFound && res.status(404).json({
      success: false,
      message: "Caso no encontrado."
    });

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const uniqueName = `${caseFound?.id}-${caseFound?.clientId}-file-${Date.now()}${ext}`;

      const newFile = {
        name: file.originalname,
        extension: file.mimetype,
        path: `${process.env.bucket}/${uniqueName}`,
        key: uniqueName,
        size: file.size
      };

      newFiles.push(newFile as File);

      const response: PutObjectCommandOutput = await aws.uploadFile(file.buffer, uniqueName, file.mimetype);
      if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 200) {
        throw new Error();
      }
    };

    await prisma.case.update({
      where: {
        id: Number(caseId)
      },
      data: {
        files: {
          create: newFiles
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Archivos subidos correctamente"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
};

export const findFile = async (req: Request, res: Response) => {
  const { id } = req.body;
  const caseId = req.params.id;
  const fileId = req.params.fileId;

  if (!id || !caseId || !fileId) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos."
    });
  }

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: Number(fileId),
        caseId: Number(caseId),
        case: {
          users: {
            some: {
              id: Number(id)
            }
          }
        }
      }
    });

    console.log(file);

    !file && res.status(404).json({
      success: false,
      message: "Archivo no encontrado."
    });

    const response = await aws.findFile(file?.key as string);
    const stream = response.Body;

    res.set({
      'Content-Type': response.ContentType,
      'Content-Length': response.ContentLength,
      'Content-Disposition': `attachment; filename=${file?.name}`,
    });

    return stream.pipe(res).status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}

// delete file by id
export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.body;
  const caseId = req.params.id;
  const fileId = req.params.fileId;

  if (!id || !caseId || !fileId) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos."
    });
  }

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: Number(fileId),
        caseId: Number(caseId),
        case: {
          users: {
            some: {
              id: Number(id)
            }
          }
        }
      }
    });

    !file && res.status(404).json({
      success: false,
      message: "Archivo no encontrado."
    });

    const response = await aws.deleteFile(file?.key as string);
    if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 204) {
      throw new Error();
    }

    await prisma.file.delete({
      where: {
        id: Number(fileId)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Archivo eliminado correctamente."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}

export const findCaseToUpdate = async (req: Request, res: Response) => {
  const { id } = req.body;
  const caseId = req.params.id;

  if (!id || !caseId) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos."
    });
  }

  try {
    const caseFound = await prisma.case.findFirst({
      where: {
        id: Number(caseId),
        users: {
          some: {
            id: Number(id)
          }
        }
      }
    });

    if (!caseFound) {
      return res.status(404).json({
        success: false,
        message: "Caso no encontrado."
      });
    }

    const lawMatters = await prisma.lawMatter.findMany({});

    res.status(200).json({
      success: true,
      data: [caseFound, lawMatters]
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor."
    });
  }
}