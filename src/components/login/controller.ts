import { Request, Response } from "express";
import prisma from "../../utils/Database";
import { User } from "@prisma/client";
import { generateToken, verifyToken } from "../../utils/Jwt";
import { verifyOtp, generate } from "../../utils/Otp";
import { JwtPayload } from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      authenticated: true,
      message: 'Porfavor ingrese un correo y contraseña.'
    });

  const user: User | null = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user || user.password !== password) {
    return res.status(401).json({
      authenticated: false,
      message: 'Credenciales incorrectas.'
    });
  }

  const payload = {
    id: user.id,
  };

  const token = generateToken(payload, '5m');

  return res.status(200).json({
    authenticated: true,
    message: 'Usuario autenticado correctamente.',
    token: token,
  });
}

export const verify2FA = async (req: Request, res: Response) => {
  const { token, secret } = req.body;
  let payload: JwtPayload | string = '';

  if (!token || !secret)
    return res.status(400).json({
      authenticated: false,
      message: 'Credenciales incorrectas.'
    });

  try {
    payload = verifyToken(token);
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: 'Token inválido.'
    });
  }

  if (typeof payload === 'string') {
    return res.status(401).json({
      authenticated: false,
      message: 'Payload inválido.'
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.id)
    },
    select: {
      id: true,
      secretKey: true
    }
  });

  if (!user || !user.secretKey) {
    return res.status(401).json({
      authenticated: false,
      message: 'Usuario no encontrado.'
    });
  }

  /* const otpSecret = generate(user.secretKey); */

  if (!verifyOtp(secret, user.secretKey)) {
    return res.status(401).json({
      authenticated: false,
      message: 'Otp inválido.',
    });
  }

  const newPayload = {
    ...user
  };

  const newToken = generateToken(newPayload, '1d');

  return res.status(200).json({
    authenticated: true,
    token: newToken
  });
}

export const verifyJwt = async (req: Request, res: Response) => {
  const { token } = req.body;
  let payload: JwtPayload | string = '';

  if (!token) {
    return res.status(400).json({
      authenticated: false,
      message: 'Token inválido.'
    });
  }

  try {
    payload = verifyToken(token);
  }
  catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: 'Token inválido.'
    });
  }

  if (typeof payload === 'string') {
    return res.status(401).json({
      authenticated: false,
      message: 'Payload inválido.'
    });
  }

  res.status(200).json({
    authenticated: true,
    message: 'Token válido.'
  });
}

/* export const generate2FA = async (req: Request, res: Response) => {
  const { token } = req.body;
  let payload: JwtPayload | string = '';

  if (!token)
    return res.status(400).json({
      authenticated: false,
      message: 'Credenciales incorrectas.'
    });

  try {
    payload = verifyToken(token);
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: 'Token inválido.'
    });
  }

  if (typeof payload === 'string') {
    return res.status(401).json({
      authenticated: false,
      message: 'Payload inválido.'
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.id)
    }
  });

  if (!user) {
    return res.status(401).json({
      authenticated: false,
      message: 'Usuario no encontrado.'
    });

  }

  const secret = generateSecret();

  const otpSecret = generate(secret);

  const keyUri = generateKeyUri(user.email, secret);

  const options: qrcode.QRCodeOptions = {
    errorCorrectionLevel: 'H'
  }

  res.status(200).json({
    authenticated: true,
    secret: secret,
    otpSecret: otpSecret,
    keyUri: keyUri
  });
} */