import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersStatistics, getTodayOrders, getAllOrders, ORDER_STATUS_TEXT } from '../controllers/OrderController';
import { getUsers } from '../controllers/UserController';
import { getAllProducts } from '../controllers/ProductController';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [todayOrders, setTodayOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const users = getUsers();
  const products = getAllProducts();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const [statsData, todayData, ordersData] = await Promise.all([
        getOrdersStatistics(),
        getTodayOrders(),
        getAllOrders()
      ]);
      setStats(statsData);
      setTodayOrders(todayData);
      setAllOrders(ordersData);
    };
    loadData();
  }, []);

  // Auto refresh when new order arrives
  useEffect(() => {
    const handleNewNotification = async () => {
      const [statsData, todayData, ordersData] = await Promise.all([
        getOrdersStatistics(),
        getTodayOrders(),
        getAllOrders()
      ]);
      setStats(statsData);
      setTodayOrders(todayData);
      setAllOrders(ordersData);
    };

    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  // Get recent orders (last 5)
  const recentOrders = allOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-chart-line"></i> Tổng Quan
          </h1>
          <p className="admin-header-subtitle">
            Chào mừng quay trở lại! Đây là tổng quan hoạt động kinh doanh của bạn.
          </p>
        </div>
        <div className="admin-header-actions">
          <div className="today-date">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng đơn hàng</p>
            <span className="stat-subtext">
              <i className="fas fa-clock"></i> Hôm nay: {todayOrders.length}
            </span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ xác nhận</p>
            {stats.pending > 0 && (
              <Link to="/admin/orders" className="stat-action">
                Xem ngay <i className="fas fa-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Đã hoàn thành</p>
            <span className="stat-subtext">
              <i className="fas fa-percentage"></i> 
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% tổng đơn
            </span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRevenue.toLocaleString('vi-VN')}đ</h3>
            <p>Doanh thu</p>
            <span className="stat-subtext">
              <i className="fas fa-chart-line"></i> Từ đơn hoàn thành
            </span>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="dashboard-row">
        <div className="dashboard-card order-status-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-tasks"></i> Tình Trạng Đơn Hàng
            </h3>
          </div>
          <div className="card-body">
            <div className="order-status-list">
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-pending"></span>
                  <span className="status-label">Chờ xác nhận</span>
                </div>
                <span className="status-count">{stats.pending}</span>
              </div>
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-confirmed"></span>
                  <span className="status-label">Đã xác nhận</span>
                </div>
                <span className="status-count">{stats.confirmed}</span>
              </div>
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-preparing"></span>
                  <span className="status-label">Đang chuẩn bị</span>
                </div>
                <span className="status-count">{stats.preparing}</span>
              </div>
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-delivering"></span>
                  <span className="status-label">Đang giao hàng</span>
                </div>
                <span className="status-count">{stats.delivering}</span>
              </div>
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-completed"></span>
                  <span className="status-label">Hoàn thành</span>
                </div>
                <span className="status-count">{stats.completed}</span>
              </div>
              <div className="order-status-item">
                <div className="status-info">
                  <span className="status-dot status-cancelled"></span>
                  <span className="status-label">Đã hủy</span>
                </div>
                <span className="status-count">{stats.cancelled}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card quick-stats-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-tachometer-alt"></i> Thống Kê Nhanh
            </h3>
          </div>
          <div className="card-body">
            <div className="quick-stat-item">
              <i className="fas fa-box quick-stat-icon"></i>
              <div className="quick-stat-info">
                <h4>{products.length}</h4>
                <p>Sản phẩm</p>
              </div>
            </div>
            <div className="quick-stat-item">
              <i className="fas fa-users quick-stat-icon"></i>
              <div className="quick-stat-info">
                <h4>{users.filter(u => u.role === 'customer').length}</h4>
                <p>Khách hàng</p>
              </div>
            </div>
            <div className="quick-stat-item">
              <i className="fas fa-truck quick-stat-icon"></i>
              <div className="quick-stat-info">
                <h4>{stats.delivering}</h4>
                <p>Đang giao</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>
            <i className="fas fa-clock"></i> Đơn Hàng Gần Đây
          </h3>
          <Link to="/admin/orders" className="view-all-link">
            Xem tất cả <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="card-body">
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>{order.customerInfo.fullname}</td>
                      <td>{order.customerInfo.phone}</td>
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
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td>
                        <Link 
                          to={`/admin/orders/${order.id}`} 
                          className="btn-action btn-action-view"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
