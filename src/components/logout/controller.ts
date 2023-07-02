import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response) => {
  
  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
    message: 'Sesión terminana exitosamente.' 
  });
}