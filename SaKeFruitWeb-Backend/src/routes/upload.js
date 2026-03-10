import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload image (Admin only)
router.post('/image', protect, adminOnly, upload.single('image'), uploadImage);

// Delete image (Admin only)
router.delete('/image/:publicId', protect, adminOnly, deleteImage);

export default router;
