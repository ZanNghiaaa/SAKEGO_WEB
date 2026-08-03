import Product from '../models/Product.js';

class ProductRepository {
  async find(query = {}, options = {}) {
    let q = Product.find(query);
    if (options.limit) {
      q = q.limit(options.limit);
    }
    if (options.sort) {
      q = q.sort(options.sort);
    }
    if (options.select) {
      q = q.select(options.select);
    }
    return await q.exec();
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async count(query = {}) {
    return await Product.countDocuments(query);
  }

  async save(productDocument) {
    return await productDocument.save();
  }
}

export default new ProductRepository();
