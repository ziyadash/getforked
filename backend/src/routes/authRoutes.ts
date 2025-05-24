import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { createVoteSession, createPosition, createCandidate, editCandidate, deleteCandidate, viewCandidates, } from '../controllers/voteCreateController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/logout', logout);

// TODO: move these to a new file called createVoteRoutes.ts or something
// because this functionality is separate from auth
router.post('/createVoteSession', createVoteSession);

// Routes for positions
router.post('/createPosition', createPosition);

// Routes for candidates
router.post('/createCandidate', createCandidate);
router.post('/editCandidate', editCandidate);
router.get('/votes/:voteId/positions/:positionId/candidates', viewCandidates);
router.delete('/votes/:voteId/positions/:positionId/candidates/:candidateIndex', deleteCandidate);


export default router;
