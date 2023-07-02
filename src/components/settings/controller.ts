import { Request, Response } from 'express';
import prisma from "../../utils/Database";
import { generateSecret, generateKeyUri, generate } from "../../utils/Otp";

export const main = async (req: Request, res: Response) => {
  const id = Number(req.body.id);

  if (!id) {
    return res.status(400).json({ message: "Id inválido." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        name: true,
        secretKey: true,
        email: true
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    if (user.secretKey) {
      return res.status(200).json({ is2faEnabled: true });
    }

    const otpSecretKey = generateSecret();
    const otpKeyUri = generateKeyUri(user.email, otpSecretKey);

    return res.status(200).json({ is2faEnabled: false, otpKeyUri, otpSecretKey });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor." });
  }
}

export const enable2fa = async (req: Request, res: Response) => {
  const id = req.body.id;
  const authCode = req.body.authCode;
  const otpSecretKey = req.body.otpSecretKey;

  console.log(id, authCode, otpSecretKey);


  if (!id || !authCode) {
    return res.status(400).json({ message: "Id o código de autenticación inválido." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        secretKey: true,
        email: true
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    if (user.secretKey) {
      return res.status(400).json({ message: "2FA ya está activado." });
    }

    const otp = generate(otpSecretKey);
    console.log(otp, authCode);

    if (authCode !== otp) {
      return res.status(400).json({ message: "Código de autenticación inválido." });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        secretKey: otpSecretKey
      }
    });

    res.status(200).json({ status: "success", message: "2FA activado." });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor." });
  }
}

export const disable2fa = async (req: Request, res: Response) => {
  const id = Number(req.body.id);

  if (!id) {
    return res.status(400).json({ message: "Id inválido." });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        secretKey: null
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ status: "success", message: "2FA desactivado." });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor." });
  }
}