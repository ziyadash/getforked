import { Router } from 'express';
import { activateElection } from 'src/controllers/voteCreateController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);

