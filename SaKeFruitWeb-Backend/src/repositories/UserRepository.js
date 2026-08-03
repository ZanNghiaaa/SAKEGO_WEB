import User from '../models/User.js';

class UserRepository {
  async findAll(query = {}, options = {}) {
    let q = User.find(query);
    if (options.select) q = q.select(options.select);
    if (options.sort) q = q.sort(options.sort);
    if (options.skip !== undefined) q = q.skip(options.skip);
    if (options.limit !== undefined) q = q.limit(options.limit);
    return await q.exec();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select('+password');
  }

  async findOne(query) {
    return await User.findOne(query);
  }

  async findOneWithPassword(query) {
    return await User.findOne(query).select('+password');
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async save(userDocument) {
    return await userDocument.save();
  }

  async count(query = {}) {
    return await User.countDocuments(query);
  }
}

export default new UserRepository();
