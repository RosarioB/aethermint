import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Authentication logic here
  next();
};

export default authMiddleware;