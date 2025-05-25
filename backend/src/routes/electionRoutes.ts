import { Router } from 'express';
import { activateElection, getResults, checkValidElectionID } from '../../src/controllers/voteCreateController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);

router.get('/results/:electionId', getResults);


router.post('/checkValidElectionID', checkValidElectionID);


export default router;
