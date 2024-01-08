import express from 'express';
import { becomeASeller, getProfileDetails } from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post('/becomeaseller', becomeASeller); // Become a seller
userRouter.get('/:userId', getProfileDetails); // Get profile details

export default userRouter;