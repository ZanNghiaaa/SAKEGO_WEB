import adminService from '../services/AdminService.js';

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit, page } = req.query;
    
    const result = await adminService.getAllOrders(status, limit, page);
    
    res.json({
      success: true,
      ...result
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
    
    const order = await adminService.updateOrderStatus(req.params.id, status, note);
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      order
    });
  } catch (error) {
    if (error.message === 'Đơn hàng không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Trạng thái không hợp lệ!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, limit, page } = req.query;
    
    const result = await adminService.getAllUsers(role, limit, page);
    
    res.json({
      success: true,
      ...result
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
    const { startDate, endDate } = req.query;
    const statistics = await adminService.getStatistics(startDate, endDate);
    
    res.json({
      success: true,
      statistics
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
    await adminService.deleteUser(req.params.id);
    
    res.json({
      success: true,
      message: 'Đã vô hiệu hóa người dùng thành công!'
    });
  } catch (error) {
    if (error.message === 'Người dùng không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Không thể xóa tài khoản admin!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getNotifications = async (req, res, next) => {
  try {
    const result = await adminService.getNotifications(req.query.limit);
    
    res.json({
      success: true,
      ...result
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
    const notification = await adminService.markNotificationRead(req.params.id);
    
    res.json({
      success: true,
      message: 'Đã đánh dấu đã đọc!',
      notification
    });
  } catch (error) {
    if (error.message === 'Thông báo không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};
