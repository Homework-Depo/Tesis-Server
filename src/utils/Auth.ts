import { sign, verify } from "jsonwebtoken";

export const generateToken = (payload: any) => {
  return sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
}