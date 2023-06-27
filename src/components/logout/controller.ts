import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response) => {
  console.log("Hola");
  
  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
    message: 'Sesión terminana exitosamente.' 
  });
}