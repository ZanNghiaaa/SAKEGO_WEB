import productService from '../services/ProductService.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, limit } = req.query;
    
    const products = await productService.getAllProducts(category, search, limit);
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại!'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công!',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      product
    });
  } catch (error) {
    if (error.message === 'Sản phẩm không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công!'
    });
  } catch (error) {
    if (error.message === 'Sản phẩm không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get product categories with counts
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};
