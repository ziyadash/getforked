import { Router } from 'express';
import { viewPositionsPublic } from '../../src/controllers/voterController';
// import { ... } from '../../src/controllers/voterController.ts';
const router = Router();

router.post('/viewPositionsPublic', viewPositionsPublic );



export default router;
