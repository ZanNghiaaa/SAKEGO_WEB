import Notification from '../models/Notification.js';

class NotificationRepository {
  async create(data) {
    return await Notification.create(data);
  }

  async find(query = {}, options = {}) {
    let q = Notification.find(query);
    if (options.sort) q = q.sort(options.sort);
    if (options.limit) q = q.limit(options.limit);
    return await q.exec();
  }

  async findById(id) {
    return await Notification.findById(id);
  }

  async count(query = {}) {
    return await Notification.countDocuments(query);
  }

  async save(notificationDoc) {
    return await notificationDoc.save();
  }
}

export default new NotificationRepository();
