import { Request, Response } from "express";
import prisma from "../../utils/Database";
import { generateSignedUrl } from "../../utils/AWS";

export const main = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "ID es requerido",
    });
  }

  try {
    const activeCases = await prisma.case.findMany({
      where: {
        status: true,
        users: {
          some: {
            id: Number(id)
          }
        }
      },
      select: {
        id: true,
        title: true,
        client: {
          select: {
            id: true,
            name: true,
            lastName: true
          }
        }
      }
    });

    const favoriteFiles = await prisma.file.findMany({
      where: {
        favorite: true,
        case: {
          users: {
            some: {
              id: Number(id)
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        path: true,
        key: true,
        signedUrl: true,
      }
    });

    for (let i = 0; i < favoriteFiles.length; i++) {
      const url = await generateSignedUrl(favoriteFiles[i].key);
      favoriteFiles[i].signedUrl = url;
    }

    return res.status(200).json({
      success: true,
      data: {
        activeCases,
        favoriteFiles
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor."
    });
  }
};