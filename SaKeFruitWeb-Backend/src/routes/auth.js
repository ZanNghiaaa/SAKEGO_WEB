import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout,
  forgotPassword,
  resetPassword,
  googleAuth
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { 
  registerValidation, 
  loginValidation, 
  validate 
} from '../middleware/validator.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
