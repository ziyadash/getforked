import { Router } from 'express';
import { activateElection, getResults, checkElectionSessionCode, endElection } from '../../src/controllers/voteCreateController';
import {joinVote } from '../../src/controllers/voterController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);
router.post('/endElection/:electionId', endElection);

router.get('/results/:electionId', getResults);


router.post('/checkElectionSessionCode', checkElectionSessionCode);

router.post('/joinVote', joinVote );

export default router;
