import { Router } from 'express';
import { checkElectionExists, checkElectionState, viewPositionsPublic, vote } from '../../src/controllers/voterController';
import { electionStateVoter } from 'src/services/voter.services';
// import { ... } from '../../src/controllers/voterController.ts';
const router = Router();

router.post('/viewPositionsPublic', viewPositionsPublic );

router.post('/vote', vote );

router.post('/checkSessionExists', checkElectionExists)
router.post('/checkSessionState', checkElectionState)

export default router;
