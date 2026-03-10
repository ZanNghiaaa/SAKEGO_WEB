import React, { useState, useEffect } from 'react';
import { 
  getAllOrders, 
  updateOrderStatus, 
  ORDER_STATUS, 
  ORDER_STATUS_TEXT 
} from '../controllers/OrderController';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  // Auto refresh when new order arrives
  useEffect(() => {
    const handleNewNotification = async () => {
      const data = await getAllOrders();
      setOrders(data);
    };

    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  // Filter orders
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      preparing: 'status-preparing',
      delivering: 'status-delivering',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || '';
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (window.confirm(`Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${ORDER_STATUS_TEXT[newStatus]}"?`)) {
      try {
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        const allOrders = await getAllOrders();
        setOrders(allOrders);
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        alert(`✅ Đã cập nhật trạng thái đơn hàng thành công!`);
      } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
      }
    }
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
      [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
      [ORDER_STATUS.PREPARING]: ORDER_STATUS.DELIVERING,
      [ORDER_STATUS.DELIVERING]: ORDER_STATUS.COMPLETED
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-shopping-bag"></i> Quản Lý Đơn Hàng
          </h1>
          <p className="admin-header-subtitle">
            Quản lý và theo dõi tất cả đơn hàng của khách hàng
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          <i className="fas fa-th"></i>
          Tất cả ({orders.length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.PENDING ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.PENDING)}
        >
          <i className="fas fa-clock"></i>
          Chờ xác nhận ({orders.filter(o => o.status === ORDER_STATUS.PENDING).length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.CONFIRMED ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.CONFIRMED)}
        >
          <i className="fas fa-check"></i>
          Đã xác nhận ({orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.PREPARING ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.PREPARING)}
        >
          <i className="fas fa-box"></i>
          Đang chuẩn bị ({orders.filter(o => o.status === ORDER_STATUS.PREPARING).length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.DELIVERING ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.DELIVERING)}
        >
          <i className="fas fa-truck"></i>
          Đang giao ({orders.filter(o => o.status === ORDER_STATUS.DELIVERING).length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.COMPLETED ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.COMPLETED)}
        >
          <i className="fas fa-check-circle"></i>
          Hoàn thành ({orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length})
        </button>
        <button 
          className={`filter-tab ${filterStatus === ORDER_STATUS.CANCELLED ? 'active' : ''}`}
          onClick={() => setFilterStatus(ORDER_STATUS.CANCELLED)}
        >
          <i className="fas fa-times-circle"></i>
          Đã hủy ({orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length})
        </button>
      </div>

      {/* Orders Table */}
      <div className="dashboard-card">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Số ĐT</th>
                    <th>Địa chỉ</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong className="order-id">{order.id}</strong>
                      </td>
                      <td>{order.customerInfo.fullname}</td>
                      <td>{order.customerInfo.phone}</td>
                      <td>
                        <div className="address-cell">
                          {order.customerInfo.address}, {order.customerInfo.ward}, {order.customerInfo.district}
                        </div>
                      </td>
                      <td>{order.items.length} món</td>
                      <td>
                        <strong className="text-success">
                          {order.totalAmount.toLocaleString('vi-VN')}đ
                        </strong>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {ORDER_STATUS_TEXT[order.status]}
                        </span>
                      </td>
                      <td>
                        <div className="time-cell">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          <br />
                          <small>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</small>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-action-view"
                            onClick={() => viewOrderDetail(order)}
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {getNextStatus(order.status) && (
                            <button 
                              className="btn-action btn-action-next"
                              onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status))}
                              title={`Chuyển sang ${ORDER_STATUS_TEXT[getNextStatus(order.status)]}`}
                            >
                              <i className="fas fa-arrow-right"></i>
                            </button>
                          )}
                          {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.COMPLETED && (
                            <button 
                              className="btn-action btn-action-cancel"
                              onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CANCELLED)}
                              title="Hủy đơn"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-receipt"></i> Chi Tiết Đơn Hàng
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Order Info */}
              <div className="order-detail-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="order-info-grid">
                  <div className="info-item">
                    <strong>Mã đơn:</strong>
                    <span>{selectedOrder.id}</span>
                  </div>
                  <div className="info-item">
                    <strong>Trạng thái:</strong>
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {ORDER_STATUS_TEXT[selectedOrder.status]}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Thời gian đặt:</strong>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="info-item">
                    <strong>Thanh toán:</strong>
                    <span>{selectedOrder.paymentMethod === 'cod' ? 'COD (Tiền mặt)' : 'Chuyển khoản'}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="order-detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="order-info-grid">
                  <div className="info-item">
                    <strong>Họ tên:</strong>
                    <span>{selectedOrder.customerInfo.fullname}</span>
                  </div>
                  <div className="info-item">
                    <strong>Số điện thoại:</strong>
                    <span>{selectedOrder.customerInfo.phone}</span>
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong>
                    <span>{selectedOrder.customerInfo.email}</span>
                  </div>
                  <div className="info-item full-width">
                    <strong>Địa chỉ giao hàng:</strong>
                    <span>
                      {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.ward}, 
                      {selectedOrder.customerInfo.district}, Cần Thơ
                    </span>
                  </div>
                  {selectedOrder.customerInfo.notes && (
                    <div className="info-item full-width">
                      <strong>Ghi chú:</strong>
                      <span>{selectedOrder.customerInfo.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="order-detail-section">
                <h3>Sản phẩm</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Tổng cộng:</strong>
                  <strong className="total-amount">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</strong>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="order-detail-section">
                  <h3>Lịch sử trạng thái</h3>
                  <div className="status-timeline">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <strong>{ORDER_STATUS_TEXT[history.status]}</strong>
                          <p>{history.note}</p>
                          <small>{new Date(history.timestamp).toLocaleString('vi-VN')}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {getNextStatus(selectedOrder.status) && (
                <button 
                  className="btn-modal btn-modal-primary"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                    closeModal();
                  }}
                >
                  <i className="fas fa-arrow-right"></i>
                  Chuyển sang {ORDER_STATUS_TEXT[getNextStatus(selectedOrder.status)]}
                </button>
              )}
              {selectedOrder.status !== ORDER_STATUS.CANCELLED && selectedOrder.status !== ORDER_STATUS.COMPLETED && (
                <button 
                  className="btn-modal btn-modal-danger"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, ORDER_STATUS.CANCELLED);
                    closeModal();
                  }}
                >
                  <i className="fas fa-times"></i>
                  Hủy đơn hàng
                </button>
              )}
              <button className="btn-modal btn-modal-secondary" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
