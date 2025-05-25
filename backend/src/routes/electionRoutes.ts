import { Router } from 'express';
import { activateElection, getResults, checkElectionSessionCode } from '../../src/controllers/voteCreateController';
import {joinVote, viewPositionsPublic } from '../../src/controllers/voterController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);

router.get('/results/:electionId', getResults);


router.post('/checkElectionSessionCode', checkElectionSessionCode);

router.post('/joinVote', joinVote );


router.post('/viewPositionsPublic', viewPositionsPublic );


export default router;
