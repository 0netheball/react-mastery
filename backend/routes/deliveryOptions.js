import express from 'express';
import { DeliveryOption } from '../models/DeliveryOption.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  const deliveryOptions = await DeliveryOption.findAll();
  let response = deliveryOptions;

  if (expand === 'estimatedDeliveryTime') {
    response = deliveryOptions.map(option => {
      let remainingDays = option.deliveryDays;
      let currentDate = new Date();

      while (remainingDays > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          remainingDays--;
        }
      }

      return {
        ...option.toJSON(),
        estimatedDeliveryTimeMs: currentDate.getTime()
      };
    });
  }

  res.json(response);
});

export default router;
