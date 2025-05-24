// import { Request, Response, NextFunction } from 'express';
// import * as voteCreateService from '../services/voteCreate.services';

// export const createVoteSession = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const {
//     title,
//     description,
//     images,
//     startDate,
//     endDate,
//     zid_requirement,
//     locationOfVote,
//   } = req.body;

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.authCreateVoteSession({
//       userSessionId,
//       title,
//       description,
//       images,
//       startDate,
//       endDate,
//       zid_requirement,
//       locationOfVote,
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }
// };

// // functionality for creating voting sessions is already done
// // gonna add the functionality for:
// // - viewing voting sessions, corresponding to the "Create Vote - View Voting Sessions"  page
// // - viewing positions in a vote, corresponding to the "Create Vote - Add Positions"  page
// // - adding a position to a vote, corresponding to the "Create Vote - Add Position"  page
// // TODO: this is a stub for the addPosition HTTP route
// export const createPosition = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const {
//     authuserId,
//     voteId,
//     title,
//     questionType,
//   } = req.body;

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.addPosition({
//       authuserId,
//       voteId,
//       title,
//       questionType,
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }
// };

// // functionality for creating votes is already done
// // functionality for creating positions in a vote is already done
// // gonna add the functionality for:
// // - viewing candidates for a position, corresponding to the "Create Vote - Add Position"  page
// // - adding candidates for a position, corresponding to the "Create Vote - Add Position"  page
// // - editing candidates for a position, corresponding to the "Create Vote - Edit Candidate"  page
// export const createCandidate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const {
//     authuserId,
//     voteId,
//     positionId,
//     name,
//   } = req.body;

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.createCandidate({
//       authuserId,
//       voteId,
//       positionId,
//       name
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }

// }

// export const editCandidate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const {
//     authuserId,
//     voteId,
//     positionId,
//     candidateIndex,
//     name,
//     description,
//     image,
//   } = req.body;

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.editCandidate({
//       authuserId,
//       voteId,
//       positionId,
//       candidateIndex,
//       name,
//       description,
//       image,
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }

// }

// export const deleteCandidate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const authuserId = req.query.authuserId as string;
//   const voteId = Number(req.params.voteId);
//   const positionId = Number(req.params.positionId);
//   const candidateIndex = Number(req.params.candidateIndex);

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.deleteCandidate({
//       authuserId,
//       voteId,
//       positionId,
//       candidateIndex,
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }
// };


// export const viewCandidates = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userSessionId = req.headers['x-session-id'] as string;
//   const authuserId = req.query.authuserId as string;
//   const voteId = Number(req.params.voteId);
//   const positionId = Number(req.params.positionId);  

//   if (!userSessionId) {
//     res.status(400).json({ error: 'Missing user session ID' });
//     return;
//   }

//   try {
//     const result = await voteCreateService.viewCandidates({
//       authuserId,
//       voteId,
//       positionId,
//     });

//     res.status(200).json({ result });
//   } catch (e) {
//     next(e);
//   }
// };
