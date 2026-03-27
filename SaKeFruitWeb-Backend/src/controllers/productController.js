import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, limit = 100 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
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
    const product = await Product.findById(req.params.id);
    
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
    const product = await Product.create(req.body);
    
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
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại!'
      });
    }

    // Sanitize combo fields - nếu không phải combo, xóa các fields combo
    const updateData = { ...req.body };

    // Nếu request không gửi isCombo hoặc isCombo=false, xóa tất cả combo fields
    if (!updateData.isCombo || updateData.isCombo === false || updateData.isCombo === 'false') {
      // Xóa combo fields khỏi update data
      delete updateData.originalPrice;
      delete updateData.discount;
      delete updateData.comboItems;
      delete updateData.isBestSeller;

      // Set về false để clear trong database
      updateData.isCombo = false;
      updateData.isBestSeller = false;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại!'
      });
    }
    
    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();
    
    // Or hard delete:
    // await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories with counts
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    
    const categories = {
      all: { name: 'Tất cả', count: products.length },
      mochi: { name: 'Bánh Mochi', count: 0 },
      tea: { name: 'Trà Sa Kê', count: 0 },
      dried: { name: 'Khô Sa Kê', count: 0 },
      'honey-cake': { name: 'Bánh Mật', count: 0 },
      snack: { name: 'Snack', count: 0 },
      combo: { name: 'Combo', count: 0 }
    };
    
    products.forEach(product => {
      if (categories[product.category]) {
        categories[product.category].count++;
      }
    });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};
