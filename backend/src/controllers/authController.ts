import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.services';

// all business logic is handled in ../services/auth.services.ts

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { zID, zPass } = req.body;
    if (!zID || !zPass) {
      res.status(400).json({ error: 'zID and zPass are required' });
      return;
    }

    const sessionId = await authService.authRegister(zID, zPass);
    res.status(200).json({ sessionId });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { zID, zPass } = req.body;
    if (!zID || !zPass) {
      res.status(400).json({ error: 'zID and zPass are required' });
      return;
    }

    const sessionId = await authService.authLogin(zID, zPass);
    res.status(200).json({ sessionId });
  } catch (error: any) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    if (!sessionId) {
      res.status(400).json({ error: 'Missing session ID' });
      return;
    }

    authService.authLogout(sessionId);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};
