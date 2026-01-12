import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    isAdmin: boolean;
  };
}

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'default_secret_key') as {
      _id: string;
      username: string;
      isAdmin: boolean;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const validateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'default_secret_key') as {
      _id: string;
      username: string;
      isAdmin: boolean;
    };
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
