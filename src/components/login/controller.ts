import { Request, Response } from "express";
import prisma from "../../utils/Database";
import { User } from "@prisma/client";
import JWT from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      status: "ERROR",
      message: 'Porfavor ingrese un correo y contraseña.'
    });

  const user: User | null = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    return res.status(400).json({
      status: "ERROR",
      message: 'Credenciales incorrectas.'
    });
  }

  if (user.password !== password) {
    return res.status(400).json({
      status: "ERROR",
      message: 'Creedenciales incorrectas.'
    });
  } 

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  const token = JWT.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    httpOnly: true
  });

  return res.status(200).json({
    status: "OK",
    message: 'Usuario logueado correctamente',
    data: user
  });
}