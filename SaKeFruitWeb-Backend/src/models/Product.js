import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Giá sản phẩm là bắt buộc'],
    min: [0, 'Giá không thể âm']
  },
  image: {
    type: String,
    default: 'https://placehold.co/400x300/gray/white?text=No+Image'
  },
  description: {
    type: String,
    required: [true, 'Mô tả sản phẩm là bắt buộc']
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    enum: ['tea', 'rice-milk', 'mochi'],
    default: 'tea'
  },
  stock: {
    type: Number,
    required: [true, 'Số lượng tồn kho là bắt buộc'],
    min: [0, 'Số lượng không thể âm'],
    default: 0
  },
  isTrial: {
    type: Boolean,
    default: false
  },
  isReadyToEat: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

// Virtual for category display name
productSchema.virtual('categoryName').get(function() {
  const categoryNames = {
    'tea': 'Trà Sa Kê',
    'rice-milk': 'Sữa Gạo Sa Kê',
    'mochi': 'Bánh Mochi Sa Kê'
  };
  return categoryNames[this.category] || this.category;
});

// Method to update stock after order
productSchema.methods.updateStock = function(quantity) {
  this.stock -= quantity;
  this.soldCount += quantity;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
