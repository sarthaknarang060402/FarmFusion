import express from 'express';
import authRoutes from './auth.js';
import orderRoutes from './order.js';
import productRoutes from './product.js';
import cartRoutes from './cart.js';
import checkoutRoutes from './checkout.js';
import contactFormRoutes from './contactForm.js';
import userRoutes from './user.js'

const apiRouter = express.Router()

apiRouter.use('/auth', authRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/checkout', checkoutRoutes);
apiRouter.use('/contactform', contactFormRoutes);
apiRouter.use('/user', userRoutes)

export default apiRouter;
