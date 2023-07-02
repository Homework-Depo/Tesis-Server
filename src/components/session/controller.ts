import { Request, Response } from 'express';
import { verifyToken } from '../../utils/Jwt';

interface decodedToken {
  id?: number;
  tokenType?: string;
}

export const hasAccessToken = (req: Request, res: Response) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    return res.status(200).json({
      tokenType: 'none',
    });
  }

  try {
    const payload = verifyToken(cookie) as decodedToken;


    return res.status(200).json({
      tokenType: payload.tokenType
    });
  } catch (error) {
    return res.status(200).json({
      tokenType: 'none',
    });
  }
};