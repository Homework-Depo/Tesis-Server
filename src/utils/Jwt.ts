import { sign, verify } from "jsonwebtoken";

export const generateToken = (payload: any, expiresIn: string) => {
  return sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn,
  });
}

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
}

