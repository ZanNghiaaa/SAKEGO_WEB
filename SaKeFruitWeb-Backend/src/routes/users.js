import express from 'express';
import {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin only route
router.get('/', protect, adminOnly, getAllUsers);

// Protected routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
