import { Router } from 'express';
import { activateElection, getResults } from '../../src/controllers/voteCreateController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);

router.get('/results/:electionId', getResults);




export default router;
