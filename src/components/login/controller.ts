import { Request, Response } from "express";
import prisma from "../../utils/Database";
import { User } from "@prisma/client";
import { generateToken } from "../../utils/Jwt";
import DecodedToken from "../../models/DecodedToken";
import { compare } from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Porfavor ingrese un correo y contraseña.'
    });
  }

  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user || typeof user !== 'object') {
      res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas.'
      });
    }

    const isPasswordValid = await compare(password, user?.password as string);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña incorrecta.'
      });
    }

    const payload: DecodedToken = {
      id: user?.id,
    };

    if (user?.secretKey) {
      payload.tokenType = "auth"
      const token = generateToken(payload, '5m');

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 300000
      })

      return res.status(200).json({
        success: true,
        authCodeRequired: true,
        message: 'Usuario autenticado correctamente.'
      });
    } else {
      payload.tokenType = "access";
      const token = generateToken(payload, '7d');

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 604800000
      })

      return res.status(200).json({
        success: true,
        authCodeRequired: false,
        message: 'Usuario autenticado correctamente.'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error al autenticar usuario.'
    });
  }
}