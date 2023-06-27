import { Request, Response } from 'express';
import prisma from "../../utils/Database";
import { generateSecret, generateKeyUri } from "../../utils/Otp";

export const main = async (req: Request, res: Response) => {
  const id = Number(req.body.id);

  if (!id) {
    return res.status(400).json({ message: "Missing id" });
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
      return res.status(400).json({ message: "User not found" });
    }

    if (user.secretKey) {
      return res.status(200).json({ is2faEnabled: true });
    }

    const otpSecretKey = generateSecret();
    const otpKeyUri = generateKeyUri(user.email, otpSecretKey);

    return res.status(200).json({ is2faEnabled: false, otpKeyUri, otpSecretKey });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const verify2fa = async (req: Request, res: Response) => {
}