import express from 'express';
import { signup, signin, verifyToken } from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/verify-token', verifyToken);

export default authRouter;

