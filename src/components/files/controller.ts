import { Request, Response } from "express";
import { uploadFile, deleteFile } from "../../utils/AWS";
import prisma from "../../utils/Database";

export const uploadFiles = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const filesUploaded: any[] = [];

  if (!files) {
    return res.status(400).json({
      success: false,
      message: "No se ha seleccionado ningún archivo"
    });
  }

  for (const file of files) {
    const response = await uploadFile(file.buffer, file.originalname, file.mimetype);
    filesUploaded.push(response);
  };

  res.status(200).json({
    success: true,
    message: "Archivos subidos correctamente"
  });
};

export const toggleFavorite = async (req: Request, res: Response) => {
  const { id } = req.body;
  const { fileId } = req.params;

  if (!id || !fileId) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos"
    });
  }

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: Number(fileId)
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }

    await prisma.file.update({
      where: {
        id: Number(fileId)
      },
      data: {
        favorite: !file.favorite
      }
    });

    return res.status(200).json({
      success: true,
      message: "Archivo actualizado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}