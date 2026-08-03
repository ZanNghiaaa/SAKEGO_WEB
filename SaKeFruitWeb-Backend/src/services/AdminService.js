import orderRepository from '../repositories/OrderRepository.js';
import userRepository from '../repositories/UserRepository.js';
import productRepository from '../repositories/ProductRepository.js';
import notificationRepository from '../repositories/NotificationRepository.js';

class AdminService {
  async getAllOrders(status, limit = 100, page = 1) {
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    
    const orders = await orderRepository.find(query, {
      populate: [
        { path: 'userId', select: 'fullname email phone' },
        { path: 'items.productId' }
      ],
      sort: { createdAt: -1 },
      limit: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit
    });
    
    const total = await orderRepository.count(query);
    
    return {
      count: orders.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      orders
    };
  }

  async updateOrderStatus(id, status, note) {
    const order = await orderRepository.findById(id);
    
    if (!order) {
      throw new Error('Đơn hàng không tồn tại!');
    }
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ!');
    }
    
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Đơn hàng chuyển sang trạng thái: ${status}`
    });
    
    if (status === 'completed') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.deliveredAt = Date.now();
    }
    
    if (status === 'cancelled' && !order.cancelledAt) {
      order.cancelledAt = Date.now();
      order.cancelReason = note || 'Admin hủy đơn';
      
      // Restore product stock
      for (const item of order.items) {
        const product = await productRepository.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          product.soldCount -= item.quantity;
          await productRepository.save(product);
        }
      }
    }
    
    await orderRepository.save(order);
    
    // Create notification for customer
    await notificationRepository.create({
      type: 'order_status',
      title: '📦 Cập nhật đơn hàng',
      message: `Đơn hàng ${order.orderNumber} đã chuyển sang trạng thái: ${status}`,
      recipientId: order.userId,
      orderId: order._id,
      data: {
        orderId: order.orderNumber,
        status,
        note
      }
    });
    
    return order;
  }

  async getAllUsers(role, limit = 100, page = 1) {
    let query = {};
    if (role) {
      query.role = role;
    }
    
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    
    const users = await userRepository.findAll(query, {
      select: '-password',
      sort: { createdAt: -1 },
      limit: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit
    });
    
    const total = await userRepository.count(query);
    
    return {
      count: users.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      users
    };
  }

  async getStatistics() {
    const orderStats = await orderRepository.getStatistics();
    
    const totalUsers = await userRepository.count();
    const totalCustomers = await userRepository.count({ role: 'customer' });
    const newUsersThisMonth = await userRepository.count({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    const totalProducts = await productRepository.count({ isActive: true });
    const lowStockProducts = await productRepository.count({ stock: { $lt: 10 }, isActive: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await orderRepository.count({ createdAt: { $gte: today } });
    
    const topProducts = await productRepository.find({ isActive: true }, {
      sort: { soldCount: -1 },
      limit: 5,
      select: 'name soldCount price image'
    });
    // Wait, ProductRepository doesn't support select.
    // I need to update ProductRepository to support options.select. Let's do it after this.

    const recentOrders = await orderRepository.find({}, {
      populate: { path: 'userId', select: 'fullname' },
      sort: { createdAt: -1 },
      limit: 10,
      select: 'orderNumber totalAmount status createdAt userId'
    });
    // Wait, OrderRepository doesn't support select.
    
    return {
      orders: {
        ...orderStats,
        todayOrders
      },
      users: {
        total: totalUsers,
        customers: totalCustomers,
        newThisMonth: newUsersThisMonth
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      topProducts,
      recentOrders
    };
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    
    if (!user) {
      throw new Error('Người dùng không tồn tại!');
    }
    
    if (user.role === 'admin') {
      throw new Error('Không thể xóa tài khoản admin!');
    }
    
    user.isActive = false;
    await userRepository.save(user);
    return true;
  }

  async getNotifications(limit = 50) {
    const parsedLimit = parseInt(limit);
    
    const query = {
      $or: [
        { recipientRole: 'admin' },
        { recipientRole: 'all' }
      ]
    };
    
    const notifications = await notificationRepository.find(query, {
      sort: { createdAt: -1 },
      limit: parsedLimit
    });
    
    const unreadCount = await notificationRepository.count({
      ...query,
      isRead: false
    });
    
    return {
      count: notifications.length,
      unreadCount,
      notifications
    };
  }

  async markNotificationRead(id) {
    const notification = await notificationRepository.findById(id);
    
    if (!notification) {
      throw new Error('Thông báo không tồn tại!');
    }
    
    notification.isRead = true;
    notification.readAt = Date.now();
    await notificationRepository.save(notification);
    
    return notification;
  }
}

export default new AdminService();
