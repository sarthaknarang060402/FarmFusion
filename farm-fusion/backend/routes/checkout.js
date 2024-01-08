import express from 'express';

import { createCheckoutSession } from '../controllers/checkout.js';

const checkoutRouter = express.Router();

checkoutRouter.post('/', createCheckoutSession); // Create a checkout session

export default checkoutRouter;