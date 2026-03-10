import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { getCurrentUser, logoutUser, isAdmin } from '../controllers/UserController';
import { getOrdersStatistics } from '../controllers/OrderController';
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead, requestNotificationPermission } from '../controllers/NotificationController';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
    }
  }, [navigate]);

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      const data = await getOrdersStatistics();
      setStats(data);
    };
    loadStats();
  }, []);

  // Load notifications
  useEffect(() => {
    loadNotifications();
    requestNotificationPermission();

    // Listen for new notifications
    const handleNewNotification = async () => {
      loadNotifications();
      const data = await getOrdersStatistics();
      setStats(data);
    };

    window.addEventListener('newNotification', handleNewNotification);
    window.addEventListener('notificationRead', handleNewNotification);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
      window.removeEventListener('notificationRead', handleNewNotification);
    };
  }, []);

  const loadNotifications = () => {
    setUnreadCount(getUnreadCount());
    setNotifications(getNotifications());
  };

  const handleMarkAsRead = (notifId) => {
    markAsRead(notifId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    loadNotifications();
    setShowNotifications(false);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      navigate('/');
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="admin-container">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
      >
        <i className={`fas ${showMobileSidebar ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Mobile Overlay */}
      {showMobileSidebar && (
        <div 
          className="mobile-overlay active"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${showMobileSidebar ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <i className="fas fa-leaf"></i>
            <div className="admin-logo-text">
              <h2>SaKeFruit</h2>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="admin-user-info">
          <div className="admin-user-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="admin-user-details">
            <h4>{currentUser?.fullname}</h4>
            <span className="admin-badge">Administrator</span>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="admin-notification-section">
          <button 
            className="admin-notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Thông báo ({unreadCount} mới)</h4>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="mark-all-read">
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <i className="fas fa-bell-slash"></i>
                    <p>Không có thông báo</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        navigate('/admin/orders');
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notification-icon">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <div className="notification-content">
                        <strong>{notif.title}</strong>
                        <p>{notif.message}</p>
                        {notif.orderData && (
                          <div className="notification-order-info">
                            <span>{notif.orderData.items} sản phẩm</span>
                            <span className="notification-amount">
                              {notif.orderData.totalAmount.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        )}
                        <small>{new Date(notif.createdAt).toLocaleString('vi-VN')}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`admin-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Tổng quan</span>
          </Link>

          <Link 
            to="/admin/orders" 
            className={`admin-nav-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}
          >
            <i className="fas fa-shopping-bag"></i>
            <span>Quản lý đơn hàng</span>
            {stats.pending > 0 && (
              <span className="nav-badge">{stats.pending}</span>
            )}
          </Link>

          <Link 
            to="/admin/products" 
            className={`admin-nav-item ${location.pathname === '/admin/products' ? 'active' : ''}`}
          >
            <i className="fas fa-box"></i>
            <span>Quản lý sản phẩm</span>
          </Link>

          <Link 
            to="/admin/users" 
            className={`admin-nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}
          >
            <i className="fas fa-users"></i>
            <span>Quản lý người dùng</span>
          </Link>

          <div className="admin-nav-divider"></div>

          <Link to="/" className="admin-nav-item">
            <i className="fas fa-home"></i>
            <span>Về trang chủ</span>
          </Link>

          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
