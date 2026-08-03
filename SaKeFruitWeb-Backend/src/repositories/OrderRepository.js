import Order from '../models/Order.js';

class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async find(query = {}, options = {}) {
    let q = Order.find(query);
    if (options.sort) {
      q = q.sort(options.sort);
    }
    if (options.populate) {
      q = q.populate(options.populate);
    }
    if (options.skip !== undefined) {
      q = q.skip(options.skip);
    }
    if (options.limit !== undefined) {
      q = q.limit(options.limit);
    }
    if (options.select) {
      q = q.select(options.select);
    }
    return await q.exec();
  }

  async findById(id, options = {}) {
    let q = Order.findById(id);
    if (options.populate) {
      q = q.populate(options.populate);
    }
    return await q.exec();
  }

  async count(query = {}) {
    return await Order.countDocuments(query);
  }

  async getStatistics() {
    return await Order.getStatistics();
  }

  async save(orderDocument) {
    return await orderDocument.save();
  }
}

export default new OrderRepository();
