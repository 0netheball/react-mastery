import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { CartItem } from '../models/CartItem.js';
import { Order } from '../models/Order.js';
import { defaultUser } from '../defaultData/defaultUser.js';

const router = Router();
const google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post('/google', async (req, res) => {
  const ticket = await google.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, name, sub: googleId, picture } = ticket.getPayload();
  let user = await User.findOne({ where: { googleId } });
  if (!user) {
    user = await User.create({ email, name, googleId, picture });
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
  } else if (picture) {
    await user.update({ picture });
  }
  const token = jwt.sign({ userId: user.id, email: user.email, picture: user.picture }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user.id, email: user.email, picture: user.picture } });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.json({ user: null });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, { attributes: ['id', 'email', 'picture'] });
    if (!user) return res.json({ user: null });
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ ok: true });
});

export default router;