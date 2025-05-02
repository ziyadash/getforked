import { Router } from 'express';
import { register, login, logout, createVoteSession } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/logout', logout);
router.post('/createVoteSession', createVoteSession);

export default router;
