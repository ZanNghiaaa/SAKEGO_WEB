import orderRepository from '../repositories/OrderRepository.js';
import userRepository from '../repositories/UserRepository.js';
import productRepository from '../repositories/ProductRepository.js';
import notificationRepository from '../repositories/NotificationRepository.js';
import { sendEmail, thankYouEmail } from '../utils/email.js';
import userModel from '../models/User.js';
import Order from '../models/Order.js';

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

    // Send thank you email when order is delivered successfully
    if (status === 'completed') {
      try {
        // Get customer email - order.userId might be populated or just an ID
        let customerEmail = null;
        if (order.userId?.email) {
          customerEmail = order.userId.email;
        } else {
          const customer = await userModel.findById(order.userId).select('email fullname');
          if (customer) {
            customerEmail = customer.email;
            order.userId = customer; // attach for template
          }
        }
        if (customerEmail) {
          sendEmail({
            email: customerEmail,
            subject: '🎉 Giao hàng thành công - Cảm ơn bạn đã ủng hộ SAKEGO!',
            html: thankYouEmail(order)
          });
        }
      } catch (emailErr) {
        console.error('Failed to send thank you email:', emailErr);
      }
    }

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

  async getStatistics(startDate, endDate) {
    // Determine the date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        let end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = end;
      }
    }

    // Get order stats with date filter
    const totalOrders = await orderRepository.count(dateFilter);
    const pendingOrders = await orderRepository.count({ ...dateFilter, status: 'pending' });
    const confirmedOrders = await orderRepository.count({ ...dateFilter, status: 'confirmed' });
    const preparingOrders = await orderRepository.count({ ...dateFilter, status: 'preparing' });
    const deliveringOrders = await orderRepository.count({ ...dateFilter, status: 'delivering' });
    const completedOrders = await orderRepository.count({ ...dateFilter, status: 'completed' });
    const cancelledOrders = await orderRepository.count({ ...dateFilter, status: 'cancelled' });
    
    // Calculate total revenue with date filter
    const revenueResult = await Order.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

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
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      preparing: preparingOrders,
      delivering: deliveringOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      totalRevenue: totalRevenue,
      todayOrders,
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
