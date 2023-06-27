import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/Jwt";

interface decodedToken {
  id: number;
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies.jwt;

  try {
    const payload: decodedToken = verifyToken(cookie) as decodedToken;
    req.body.id = payload.id;

    next();
  } catch (error) {
    return res.status(402).json({ message: "Unauthorized" });
  }
}

export default validateToken;