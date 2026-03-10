import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { orderValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', orderValidation, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

export default router;
