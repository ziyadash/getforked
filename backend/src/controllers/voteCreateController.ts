import { Request, Response, NextFunction } from 'express';
import * as voteCreateService from '../services/voteCreate.services';
import * as electionSessionService from '../services/electionSession.services'

export const createElection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  const {
    title,
    description,
    images,
    startDate,
    endDate,
    zid_requirement,
    locationOfVote,
  } = req.body;

  const props: voteCreateService.CreateElectionProps = {
    userSessionId,
    title,
    description,
    images,
    startDate: new Date(startDate),  // ensure it's a Date object
    endDate: new Date(endDate),
    zid_requirement,
    locationOfVote,
  };

  try {
    const result = await voteCreateService.createElection(props);
    res.status(200).json({ electionId: result });
  } catch (e) {
    next(e);
  }
};

export const createPosition = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userSessionId = req.headers['x-session-id'] as string;
  
    if (!userSessionId) {
      res.status(400).json({ error: 'Missing user session ID' });
      return;
    }
  
    const {
      voteId,
      title,
      questionType,
    } = req.body;
  
    const props: voteCreateService.CreatePositionProps = {
      userSessionId,
      voteId,
      title,
      questionType,
    };
  
    try {
      const result = await voteCreateService.createPosition(props);
      res.status(200).json({ result });
    } catch (e) {
      next(e);
    }
  };

export const deletePosition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;
  const voteId = Number(req.params.voteId);
  const positionId = Number(req.params.positionId);

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  try {
    const result = await voteCreateService.deletePosition({
      userSessionId,
      voteId,
      positionId,
    });

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const reorderPositions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;
  const { voteId, newOrder } = req.body;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing session token' });
    return;
  }

  try {
    const result = await voteCreateService.reorderPositions({
      userSessionId,
      voteId,
      newOrder,
    });

    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

export const viewPositions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;
  const voteId = Number(req.params.voteId);

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  try {
    const result = await voteCreateService.viewPositions({
      userSessionId,
      voteId,
    });

    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

export const createCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  const {
    voteId,
    positionId,
    name,
  } = req.body;

  const props: voteCreateService.CreateCandidateProps = {
    userSessionId,
    voteId,
    positionId,
    name,
  };

  try {
    const result = await voteCreateService.createCandidate(props);
    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

export const editCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  const {
    voteId,
    positionId,
    candidateIndex,
    name,
    description,
    image,
  } = req.body;

  const props: voteCreateService.EditCandidateProps = {
    userSessionId,
    voteId,
    positionId,
    candidateIndex,
    name,
    description,
    image,
  };

  try {
    const result = await voteCreateService.editCandidate(props);
    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

export const deleteCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  const voteId = Number(req.params.voteId);
  const positionId = Number(req.params.positionId);
  const candidateIndex = Number(req.params.candidateIndex);

  const props: voteCreateService.DeleteCandidateProps = {
    userSessionId,
    voteId,
    positionId,
    candidateIndex,
  };

  try {
    const result = await voteCreateService.deleteCandidate(props);
    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};


export const viewCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSessionId = req.headers['x-session-id'] as string;

  if (!userSessionId) {
    res.status(400).json({ error: 'Missing user session ID' });
    return;
  }

  const voteId = Number(req.params.voteId);
  const positionId = Number(req.params.positionId);

  const props: voteCreateService.ViewCandidateProps = {
    userSessionId,
    voteId,
    positionId,
  };

  try {
    const result = await voteCreateService.viewCandidates(props);
    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

export const activateElection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const electionId = String(req.params.electionId);
  console.log('hi')

  if (!electionId) {
    res.status(400).json({ error: 'Missing election ID' });
    return;
  }

  try {
    const result = await electionSessionService.activateElectionSession(electionId);
    res.status(200).json({ electionId: result });
  } catch (e) {
    next(e);
  }
};