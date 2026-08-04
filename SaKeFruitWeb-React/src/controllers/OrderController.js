// ============================================================
// OrderController.js
// Gọi backend API thật thay vì dùng localStorage
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
  [ORDER_STATUS.DELIVERING]: 'Đang giao hàng',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

// Can Tho districts
export const CAN_THO_DISTRICTS = [
  'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn',
  'Thốt Nốt', 'Phong Điền', 'Cờ Đỏ', 'Vĩnh Thạnh', 'Thới Lai'
];

// Lấy auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

// Chuẩn hóa order từ backend
const normalizeOrder = (order) => ({
  ...order,
  id: order._id?.toString() || order.id,
  _id: order._id?.toString() || order.id,
  items: (order.items || []).map(item => ({
    ...item,
    id: item.productId?._id?.toString() || item.productId?.toString() || item.id,
    productId: item.productId?._id?.toString() || item.productId?.toString() || item.id,
    name: item.name || item.productId?.name || 'Sản phẩm',
    price: item.price || item.productId?.price || 0,
    image: item.image || item.productId?.image || '/assets/images/hero_tea.jpg',
    category: item.category || item.productId?.category || ''
  }))
});

// -------------------------------------------------------
// Tạo đơn hàng mới (Customer)
// -------------------------------------------------------
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        customerInfo: {
          fullname: orderData.fullname,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          district: orderData.district,
          ward: orderData.ward || '',
        },
        notes: orderData.notes || '',
        items: orderData.items.map(item => ({
          productId: item._id || item.id || item.productId,
          quantity: item.quantity
        })),
        paymentMethod: orderData.paymentMethod || 'cod'
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Đặt hàng thất bại!');

    window.dispatchEvent(new Event('newNotification'));
    return normalizeOrder(data.order);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// -------------------------------------------------------
// Lấy đơn hàng của user hiện tại
// -------------------------------------------------------
export const getOrdersByUserId = async () => {
  try {
    const res = await fetch(`${API_URL}/orders/my-orders`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!data.success) return [];
    return (data.orders || []).map(normalizeOrder);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// -------------------------------------------------------
// Lấy đơn hàng theo ID
// -------------------------------------------------------
export const getOrderById = async (orderId) => {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Không tìm thấy đơn hàng!');
    return normalizeOrder(data.order);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// -------------------------------------------------------
// Lấy tất cả đơn hàng (Admin only)
// -------------------------------------------------------
export const getAllOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/orders`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!data.success) return [];
    return (data.orders || []).map(normalizeOrder);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// -------------------------------------------------------
// Cập nhật trạng thái đơn hàng (Admin only)
// -------------------------------------------------------
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  try {
    const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({
        status: newStatus,
        note: note || `Cập nhật trạng thái sang ${ORDER_STATUS_TEXT[newStatus]}`
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Cập nhật thất bại!');
    return normalizeOrder(data.order);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// -------------------------------------------------------
// Hủy đơn hàng (Customer)
// -------------------------------------------------------
export const cancelOrder = async (orderId, reason = '') => {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Hủy đơn thất bại!');
    return normalizeOrder(data.order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// -------------------------------------------------------
// Thống kê đơn hàng (Admin)
// -------------------------------------------------------
export const getOrdersStatistics = async (startDate, endDate) => {
  try {
    let url = `${API_URL}/admin/statistics`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!data.success) throw new Error('Lỗi thống kê');
    
    // Map dữ liệu từ backend sang format Frontend cần
    const stats = data.statistics || {};
    return {
      total: stats.total || 0,
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      preparing: stats.preparing || 0,
      delivering: stats.delivering || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0,
      totalRevenue: stats.totalRevenue || 0
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      total: 0, pending: 0, confirmed: 0, preparing: 0,
      delivering: 0, completed: 0, cancelled: 0, totalRevenue: 0
    };
  }
};

export const getTodayOrders = async () => {
  try {
    const orders = await getAllOrders();
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === today;
    });
  } catch (error) {
    return [];
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const res = await fetch(`${API_URL}/admin/orders?status=${status}`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!data.success) return [];
    return (data.orders || []).map(normalizeOrder);
  } catch (error) {
    return [];
  }
};
