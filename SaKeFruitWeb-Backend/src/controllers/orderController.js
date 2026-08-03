import orderService from '../services/OrderService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, customerInfo, paymentMethod, notes } = req.body;
    
    const order = await orderService.createOrder(
      req.user.id,
      items,
      customerInfo,
      paymentMethod,
      notes
    );
    
    res.status(201).json({
      success: true,
      message: '🎉 Đặt hàng thành công!',
      order
    });
  } catch (error) {
    if (error.message.startsWith('⚠️') || error.message.includes('không hợp lệ') || error.message.includes('không tồn tại') || error.message.includes('không đủ số lượng')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    
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
    const order = await orderService.getOrder(req.params.id, req.user.id, req.user.role);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    if (error.message === 'Đơn hàng không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Không có quyền xem đơn hàng này!') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.id, req.body.reason);
    
    res.json({
      success: true,
      message: 'Đã hủy đơn hàng thành công!',
      order
    });
  } catch (error) {
    if (error.message === 'Đơn hàng không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Không có quyền hủy đơn hàng này!') {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error.message === 'Không thể hủy đơn hàng ở trạng thái này!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
