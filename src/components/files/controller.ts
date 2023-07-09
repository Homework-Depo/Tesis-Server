import { Request, Response } from "express";
import { uploadFile, deleteFile } from "../../utils/AWS";

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