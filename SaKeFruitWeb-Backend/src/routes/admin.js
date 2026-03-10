import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getStatistics,
  deleteUser,
  getNotifications,
  markNotificationRead
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(adminOnly);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Statistics
router.get('/statistics', getStatistics);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

export default router;
