import { Request, Response } from 'express';
import { verifyToken, generateToken } from '../../utils/Jwt';
import { generate } from '../../utils/Otp';
import prisma from '../../utils/Database';
import DecodedToken from '../../models/DecodedToken'

export const verifyAuth = async (req: Request, res: Response) => {
  const cookie = req.cookies.jwt;
  const authCode = req.body.authCode;

  if (!cookie || !authCode) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales incorrectas.'
    });
  }

  try {
    const payload = verifyToken(cookie) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(payload.id)
      }
    });

    const otpSecret = generate(user?.secretKey!);

    if (authCode != otpSecret) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas.'
      });
    }

    const newPayload: DecodedToken = {
      id: user?.id,
      tokenType: "access"
    }

    const token = generateToken(newPayload, "7d");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 604800000,
    });

    return res.status(200).json({
      success: true,
      message: 'Credenciales correctas.'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};