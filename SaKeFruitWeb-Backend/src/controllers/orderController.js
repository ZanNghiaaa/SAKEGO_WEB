import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { sendEmail, orderConfirmationEmail } from '../utils/email.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, customerInfo, paymentMethod, notes } = req.body;
    
    // Validate Can Tho address
    const canThoDistricts = [
      'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn',
      'Thốt Nốt', 'Phong Điền', 'Cờ Đỏ', 'Vĩnh Thạnh', 'Thới Lai'
    ];
    
    if (!canThoDistricts.includes(customerInfo.district)) {
      return res.status(400).json({
        success: false,
        message: '⚠️ Hiện tại chúng tôi chỉ giao hàng tại TP. Cần Thơ!'
      });
    }
    
    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Sản phẩm ${item.productId} không tồn tại!`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" không đủ số lượng trong kho!`
        });
      }
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        category: product.category
      });
      
      totalAmount += product.price * item.quantity;
      
      // Update product stock
      await product.updateStock(item.quantity);
    }
    
    // Create order
    const order = await Order.create({
      userId: req.user.id,
      customerInfo: {
        ...customerInfo,
        notes: notes || ''
      },
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Đơn hàng được tạo'
      }]
    });
    
    // Create notification for admin
    await Notification.create({
      type: 'new_order',
      title: '🛒 Đơn hàng mới!',
      message: `${customerInfo.fullname} đã đặt đơn hàng ${order.orderNumber}`,
      recipientRole: 'admin',
      orderId: order._id,
      data: {
        orderId: order.orderNumber,
        customerName: customerInfo.fullname,
        totalAmount: order.totalAmount,
        itemCount: order.items.length
      }
    });
    
    // Populate product details
    await order.populate('items.productId');
    
    // Send confirmation email to customer
    try {
      await sendEmail({
        email: customerInfo.email,
        subject: '✅ Xác nhận đơn hàng - SaKeFruit',
        html: orderConfirmationEmail(order)
      });
      console.log('✉️ Email xác nhận đã được gửi đến:', customerInfo.email);
    } catch (emailError) {
      console.error('⚠️ Không thể gửi email:', emailError.message);
      // Continue even if email fails - don't block order creation
    }
    
    res.status(201).json({
      success: true,
      message: '🎉 Đặt hàng thành công!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')
      .populate('userId', 'fullname email phone');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại!'
      });
    }
    
    // Check if user owns this order or is admin
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xem đơn hàng này!'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại!'
      });
    }
    
    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy đơn hàng này!'
      });
    }
    
    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đơn hàng ở trạng thái này!'
      });
    }
    
    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        await product.save();
      }
    }
    
    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.reason || 'Khách hàng hủy đơn';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: order.cancelReason
    });
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Đã hủy đơn hàng thành công!',
      order
    });
  } catch (error) {
    next(error);
  }
};
