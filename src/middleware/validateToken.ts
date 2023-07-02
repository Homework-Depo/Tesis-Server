import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/Jwt";
import DecodedToken from "../models/DecodedToken";

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies.jwt;

  try {
    const payload: DecodedToken = verifyToken(cookie) as DecodedToken;

    if (payload.tokenType !== "access" || !payload.id) {
      return res.status(402).json({ success: false, message: "Unauthorized" });
    }

    req.body.id = payload.id;

    next();
  } catch (error) {
    return res.status(402).json({ message: "Unauthorized" });
  }
}

export const validateAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies.jwt;

  try {
    const payload: DecodedToken = verifyToken(cookie) as DecodedToken;

    if (payload.tokenType !== "auth" || !payload.id) {
      return res.status(402).json({ success: false, message: "Unauthorized" });
    }

    req.body.id = payload.id;

    next();
  } catch (error) {
    return res.status(402).json({ message: "Unauthorized" });
  }
}