import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 100, page = 1 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'fullname email phone')
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại!'
      });
    }
    
    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ!'
      });
    }
    
    // Update order
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
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          product.soldCount -= item.quantity;
          await product.save();
        }
      }
    }
    
    await order.save();
    
    // Create notification for customer
    await Notification.create({
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
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, limit = 100, page = 1 } = req.query;
    
    let query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
export const getStatistics = async (req, res, next) => {
  try {
    // Get order stats
    const orderStats = await Order.getStatistics();
    
    // Get user stats
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    // Get product stats
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    
    // Get top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(5)
      .select('name soldCount price image');
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'fullname')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber totalAmount status createdAt userId');
    
    res.json({
      success: true,
      statistics: {
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
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại!'
      });
    }
    
    // Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản admin!'
      });
    }
    
    // Soft delete
    user.isActive = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Đã vô hiệu hóa người dùng thành công!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getNotifications = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    
    const notifications = await Notification.find({
      $or: [
        { recipientRole: 'admin' },
        { recipientRole: 'all' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const unreadCount = await Notification.countDocuments({
      $or: [
        { recipientRole: 'admin' },
        { recipientRole: 'all' }
      ],
      isRead: false
    });
    
    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Thông báo không tồn tại!'
      });
    }
    
    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();
    
    res.json({
      success: true,
      message: 'Đã đánh dấu đã đọc!',
      notification
    });
  } catch (error) {
    next(error);
  }
};
