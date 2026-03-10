import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { productValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories/all', getCategories);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', protect, adminOnly, productValidation, validate, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
