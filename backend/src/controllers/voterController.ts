import { Request, Response, NextFunction } from 'express';
import * as voterServices from '../services/voter.services'
import * as electionSessionService from '../services/electionSession.services'



  export const joinVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionCode , sessionId } = req.body;

    if (!sessionCode || !sessionId) {
      res.status(400).json({ error: 'Missing election sessionCode or sessionID' });
      return;
    }

    try {
      const result = await electionSessionService.addUsertoActiveElectionSession(sessionCode, sessionId);

   res.status(200).json({ results: result });
    } catch (e) {
      next(e);
    }
                   

  };