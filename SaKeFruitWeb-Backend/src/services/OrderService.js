import orderRepository from '../repositories/OrderRepository.js';
import productRepository from '../repositories/ProductRepository.js';
import Notification from '../models/Notification.js';
import { sendEmail, orderConfirmationEmail } from '../utils/email.js';
import mongoose from 'mongoose';

class OrderService {
  async createOrder(userId, items, customerInfo, paymentMethod, notes) {
    // Validate Can Tho address
    const canThoDistricts = [
      'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn',
      'Thốt Nốt', 'Phong Điền', 'Cờ Đỏ', 'Vĩnh Thạnh', 'Thới Lai'
    ];
    
    if (!canThoDistricts.includes(customerInfo.district)) {
      throw new Error('⚠️ Hiện tại chúng tôi chỉ giao hàng tại TP. Cần Thơ!');
    }
    
    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Sản phẩm trong giỏ hàng không hợp lệ. Vui lòng làm mới trang và thêm sản phẩm lại!`);
      }

      const product = await productRepository.findById(item.productId);
      
      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại!`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ số lượng trong kho!`);
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
    const order = await orderRepository.create({
      userId,
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
    
    // Send confirmation email to customer (Non-blocking)
    sendEmail({
      email: customerInfo.email,
      subject: '✅ Xác nhận đơn hàng - SaKeGo',
      html: orderConfirmationEmail(order)
    });
    
    return order;
  }

  async getMyOrders(userId) {
    return await orderRepository.find(
      { userId },
      { populate: 'items.productId', sort: { createdAt: -1 } }
    );
  }

  async getOrder(id, userId, userRole) {
    const order = await orderRepository.findById(id, {
      populate: [
        { path: 'items.productId' },
        { path: 'userId', select: 'fullname email phone' }
      ]
    });
    
    if (!order) {
      throw new Error('Đơn hàng không tồn tại!');
    }
    
    // Check if user owns this order or is admin
    if (order.userId._id.toString() !== userId && userRole !== 'admin') {
      throw new Error('Không có quyền xem đơn hàng này!');
    }
    
    return order;
  }

  async cancelOrder(id, userId, reason) {
    const order = await orderRepository.findById(id);
    
    if (!order) {
      throw new Error('Đơn hàng không tồn tại!');
    }
    
    // Check if user owns this order
    if (order.userId.toString() !== userId) {
      throw new Error('Không có quyền hủy đơn hàng này!');
    }
    
    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new Error('Không thể hủy đơn hàng ở trạng thái này!');
    }
    
    // Restore product stock
    for (const item of order.items) {
      const product = await productRepository.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        await productRepository.save(product);
      }
    }
    
    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    order.cancelReason = reason || 'Khách hàng hủy đơn';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: order.cancelReason
    });
    
    await orderRepository.save(order);
    return order;
  }
}

export default new OrderService();
