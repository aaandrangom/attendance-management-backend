import express from 'express';
import { UserController } from '../controllers/users.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', UserController.postUser);
router.post('/signIn', UserController.signIn);
router.post('/logout', authMiddleware, UserController.logout);
router.get('/logged-in', authMiddleware, UserController.getUserLoggedIn);
router.get('/testing', UserController.test)
export default router