import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.services';

// all business logic is handled in ../services/auth.services.ts

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { zId, zPass } = req.body;
  if (!zId || !zPass) {
    res.status(400).json({ error: 'zID and zPass are required' });
    return;
  }

  const result = await authService.authRegister(zId, zPass);
  if ('error' in result) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ sessionId: result.sessionId });
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { zId, zPass } = req.body;
  if (!zId || !zPass) {
    res.status(400).json({ error: 'zID and zPass are required' });
    return;
  }

  const result = await authService.authLogin(zId, zPass);
  if ('error' in result) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ sessionId: result.sessionId });
};


export const logout = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: 'Missing session token' });
    return;
  }

  const result = authService.authLogout(token);
  if (result?.error) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ message: 'Logged out successfully' });
  return; 
};

export const createVoteSession = async (req: Request, res: Response, next: NextFunction) => {
  const userSessionId = req.headers['x-session-id'] as string;
  const {
    title,
    description,
    images,
    startDate,
    endDate,
    zid_requirement, 
    locationOfVote
  } = req.body;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  try {
    const result = await authService.authCreateVoteSession(
      title, 
      description, 
      images, 
      startDate, 
      endDate, 
      zid_requirement,
      locationOfVote
    ) 

    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};
