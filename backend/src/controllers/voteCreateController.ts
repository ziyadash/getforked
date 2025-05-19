import { Request, Response, NextFunction } from 'express';
import * as voteCreateService from '../services/voteCreate.services';

export const createVoteSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;
  const {
    title,
    description,
    images,
    startDate,
    endDate,
    zid_requirement,
    locationOfVote,
  } = req.body;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  try {
    const result = await voteCreateService.authCreateVoteSession({
      userSessionId,
      title,
      description,
      images,
      startDate,
      endDate,
      zid_requirement,
      locationOfVote,
    });

    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

// gonna add the functionality for:
// - viewing voting sessions, corresponding to the "Create Vote - View Voting Sessions"  page
// - viewing positions in a vote, corresponding to the "Create Vote - Add Positions"  page
// - adding a position to a vote, corresponding to the "Create Vote - Add Position"  page
