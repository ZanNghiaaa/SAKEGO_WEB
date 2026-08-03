import productRepository from '../repositories/ProductRepository.js';

class ProductService {
  async getAllProducts(category, search, limit = 100) {
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
    
    return await productRepository.find(query, {
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    });
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async createProduct(productData) {
    return await productRepository.create(productData);
  }

  async updateProduct(id, productData) {
    let product = await productRepository.findById(id);

    if (!product) {
      throw new Error('Sản phẩm không tồn tại!');
    }

    // Sanitize combo fields
    const updateData = { ...productData };
    if (!updateData.isCombo || updateData.isCombo === false || updateData.isCombo === 'false') {
      delete updateData.originalPrice;
      delete updateData.discount;
      delete updateData.comboItems;
      delete updateData.isBestSeller;

      updateData.isCombo = false;
      updateData.isBestSeller = false;
    }

    return await productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new Error('Sản phẩm không tồn tại!');
    }
    
    // Soft delete - mark as inactive
    product.isActive = false;
    await productRepository.save(product);
    return true;
  }

  async getCategories() {
    const products = await productRepository.find({ isActive: true });
    
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
    
    return categories;
  }
}

export default new ProductService();
