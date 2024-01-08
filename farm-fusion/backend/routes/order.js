import express from 'express';
import { createOrder, getOrdersByUser, getOrdersBySeller, updateOrder } from '../controllers/order.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/:userId', getOrdersByUser);
orderRouter.get('/seller/:sellerId', getOrdersBySeller);
orderRouter.put('/', updateOrder);

export default orderRouter;
