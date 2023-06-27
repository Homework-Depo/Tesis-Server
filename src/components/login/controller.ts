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

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 300000
  })

  return res.status(200).json({
    authenticated: true,
    message: 'Usuario autenticado correctamente.'
  });
}

export const verify2FA = async (req: Request, res: Response) => {
  const { secret } = req.body;
  const cookie = req.cookies.jwt;
  console.log(cookie);

  let payload: JwtPayload | string = '';

  if (!cookie || !secret)
    return res.status(400).json({
      authenticated: false,
      message: 'Credenciales incorrectas.'
    });

  try {
    payload = verifyToken(cookie);
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

  const otpSecret = generate(user.secretKey);

  if (!verifyOtp(secret, user.secretKey)) {
    return res.status(401).json({
      authenticated: false,
      message: 'Otp inválido.',
      otpSecret: otpSecret
    });
  }

  const newPayload = {
    ...user
  };

  const newToken = generateToken(newPayload, '1d');

  res.cookie('jwt', newToken, {
    httpOnly: true,
    maxAge: 604800000
  });

  return res.status(200).json({
    authenticated: true,
    otpSecret: otpSecret
  });
}

export const verifyJwt = async (req: Request, res: Response) => {
  const cookie = req.cookies.jwt;
  let payload: JwtPayload | string = '';

  if (!cookie) {
    return res.status(400).json({
      authenticated: false,
      message: 'Token inválido.'
    });
  }

  try {
    payload = verifyToken(cookie);
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