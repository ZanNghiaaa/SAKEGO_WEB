// Order Management Controller
const API_URL = 'http://localhost:5000/api';

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',           // Chờ xác nhận
  CONFIRMED: 'confirmed',       // Đã xác nhận
  PREPARING: 'preparing',       // Đang chuẩn bị
  DELIVERING: 'delivering',     // Đang giao
  COMPLETED: 'completed',       // Hoàn thành
  CANCELLED: 'cancelled'        // Đã hủy
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
  [ORDER_STATUS.DELIVERING]: 'Đang giao hàng',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create new order (Call API)
export const createOrder = async (orderData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập để đặt hàng!');
    }
    
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: orderData.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        customerInfo: {
          fullname: orderData.fullname,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          district: orderData.district,
          ward: orderData.ward
        },
        paymentMethod: orderData.paymentMethod || 'cod',
        notes: orderData.notes || ''
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Đặt hàng thất bại!');
    }
    
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get user's orders (Call API)
export const getOrdersByUserId = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return [];
    }
    
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể tải đơn hàng!');
    }
    
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Get order by ID (Call API)
export const getOrderById = async (orderId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập!');
    }
    
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không tìm thấy đơn hàng!');
    }
    
    return data.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return [];
    }
    
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Không thể tải đơn hàng!');
    }
    
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập!');
    }
    
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus, note })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật thất bại!');
    }
    
    return data.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Can Tho districts
export const CAN_THO_DISTRICTS = [
  'Ninh Kiều',
  'Bình Thủy',
  'Cái Răng',
  'Ô Môn',
  'Thốt Nốt',
  'Phong Điền',
  'Cờ Đỏ',
  'Vĩnh Thạnh',
  'Thới Lai'
];

// Helper functions for statistics (work with API data)
export const getOrdersStatistics = async () => {
  try {
    const orders = await getAllOrders();
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
      confirmed: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length,
      preparing: orders.filter(o => o.status === ORDER_STATUS.PREPARING).length,
      delivering: orders.filter(o => o.status === ORDER_STATUS.DELIVERING).length,
      completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
      cancelled: orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
      totalRevenue: orders
        .filter(o => o.status === ORDER_STATUS.COMPLETED)
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivering: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
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
    console.error('Error getting today orders:', error);
    return [];
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const orders = await getAllOrders();
    return orders.filter(order => order.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting orders by status:', error);
    return [];
  }
};
