import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { CartItem } from '../models/CartItem.js';
import { Order } from '../models/Order.js';
import { defaultUser } from '../defaultData/defaultUser.js';

const router = Router();
const google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const ticket = await google.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, name, sub: googleId } = ticket.getPayload();
  let user = await User.findOne({ where: { googleId } });
  if (!user) {
    user = await User.create({ email, name, googleId });
    const seedCart = await CartItem.findAll({ where: { userId: defaultUser.id } });
    for (const item of seedCart) {
      await CartItem.create({
        productId: item.productId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId,
        userId: user.id
      });
    }
    const seedOrders = await Order.findAll({ where: { userId: defaultUser.id } });
    for (const order of seedOrders) {
      await Order.create({
        orderTimeMs: order.orderTimeMs,
        totalCostCents: order.totalCostCents,
        products: order.products,
        userId: user.id
      });
    }
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;