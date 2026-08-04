import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, updateUserProfile, logoutUser } from '../controllers/UserController';
import { getOrdersByUserId, ORDER_STATUS_TEXT } from '../controllers/OrderController';
import '../assets/css/profile-page.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderSuccess = location.state?.orderSuccess;
  const orderNumber = location.state?.orderNumber;
  const orderTotal = location.state?.totalAmount;

  const [showSuccessBanner, setShowSuccessBanner] = useState(orderSuccess || false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setFormData({
      fullname: currentUser.fullname,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address || ''
    });

    // Load user orders
    const loadOrders = async () => {
      const userOrders = await getOrdersByUserId();
      setOrders(userOrders);
    };
    loadOrders();

    // Auto hide success banner after 5 seconds
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSuccessBanner]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const updatedUser = updateUserProfile(user.id, formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <main>
      <section className="profile-hero">
        <div className="container">
          <h1>
            <i className="fas fa-user-circle"></i>
            Trang cá nhân
          </h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
      </section>

      <section className="profile-section">
        <div className="container">

          {/* Banner đặt hàng thành công */}
          {showSuccessBanner && (
            <div className="success-order-banner">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="success-content">
                <h3>Đặt hàng thành công! 🎉</h3>
                <p>Chúng tôi sẽ sớm liên hệ và giao hàng tận nơi tại Cần Thơ. Cảm ơn bạn đã tin tưởng Sakego! 🌿</p>
                {(orderNumber || orderTotal) && (
                  <div className="success-order-details">
                    {orderNumber && <span><i className="fas fa-receipt"></i> Mã đơn: <strong>#{String(orderNumber).slice(-6).toUpperCase()}</strong></span>}
                    {orderTotal && <span><i className="fas fa-money-bill-wave"></i> Tổng tiền: <strong>{orderTotal.toLocaleString('vi-VN')}đ</strong></span>}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="profile-grid">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <img
                    src="/assets/images/AVATAR.png"
                    alt="Avatar"
                    className="profile-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <i className="fas fa-user profile-avatar-fallback"></i>
                </div>
                <h3>{user.fullname}</h3>
                <span className="user-role">
                  {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Khách hàng'}
                </span>
              </div>



              <div className="profile-actions">
                <button
                  className="profile-btn-action btn-primary"
                  onClick={() => navigate('/cart')}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Giỏ hàng
                </button>
                <button
                  className="profile-btn-action btn-secondary"
                  onClick={() => navigate('/products')}
                >
                  <i className="fas fa-store"></i>
                  Tiếp tục mua sắm
                </button>
                <button
                  className="profile-btn-action btn-danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-content">
              <div className="profile-card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-info-circle"></i>
                    Thông tin cá nhân
                  </h2>
                  {!isEditing && (
                    <button
                      className="btn-edit"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fas fa-edit"></i>
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="info-display">
                    <div className="info-item">
                      <label>
                        <i className="fas fa-user"></i>
                        Họ và tên
                      </label>
                      <span>{user.fullname}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <span>{user.phone}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        Địa chỉ
                      </label>
                      <span>{user.address || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-user"></i>
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        Địa chỉ
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Nhập địa chỉ của bạn"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-save">
                        <i className="fas fa-save"></i>
                        Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            fullname: user.fullname,
                            email: user.email,
                            phone: user.phone,
                            address: user.address || ''
                          });
                        }}
                      >
                        <i className="fas fa-times"></i>
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Shopee-style Order History */}
              <div className="profile-card shopee-orders-card">
                <div className="shopee-orders-header" onClick={() => setActiveTab('all')}>
                  <h2>Đơn mua</h2>
                  <span className="view-all-text">Xem lịch sử mua hàng <i className="fas fa-chevron-right"></i></span>
                </div>

                <div className="shopee-orders-tabs">
                  <div className={`shopee-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    <div className="shopee-tab-icon">
                      <i className="fas fa-wallet"></i>
                      {orders.filter(o => o.status === 'pending').length > 0 && <span className="shopee-badge">{orders.filter(o => o.status === 'pending').length}</span>}
                    </div>
                    <span>Chờ xác nhận</span>
                  </div>
                  <div className={`shopee-tab ${activeTab === 'preparing' ? 'active' : ''}`} onClick={() => setActiveTab('preparing')}>
                    <div className="shopee-tab-icon">
                      <i className="fas fa-box"></i>
                      {orders.filter(o => o.status === 'preparing').length > 0 && <span className="shopee-badge">{orders.filter(o => o.status === 'preparing').length}</span>}
                    </div>
                    <span>Chờ lấy hàng</span>
                  </div>
                  <div className={`shopee-tab ${activeTab === 'delivering' ? 'active' : ''}`} onClick={() => setActiveTab('delivering')}>
                    <div className="shopee-tab-icon">
                      <i className="fas fa-truck"></i>
                      {orders.filter(o => o.status === 'delivering').length > 0 && <span className="shopee-badge">{orders.filter(o => o.status === 'delivering').length}</span>}
                    </div>
                    <span>Chờ giao hàng</span>
                  </div>
                  <div className={`shopee-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                    <div className="shopee-tab-icon">
                      <i className="fas fa-check-circle"></i>
                      {orders.filter(o => o.status === 'completed').length > 0 && <span className="shopee-badge">{orders.filter(o => o.status === 'completed').length}</span>}
                    </div>
                    <span>Hoàn thành</span>
                  </div>
                </div>

                {orders.filter(o => activeTab === 'all' || o.status === activeTab).length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-receipt"></i>
                    <p>Chưa có đơn hàng</p>
                    <button className="btn-shop-now" onClick={() => navigate('/products')}>Mua sắm ngay</button>
                  </div>
                ) : (
                  <div className="shopee-orders-list">
                    {orders.filter(o => activeTab === 'all' || o.status === activeTab).map(order => {
                      const getStatusText = (status) => ORDER_STATUS_TEXT[status] || status;

                      return (
                        <div key={order.id} className="shopee-order-item">
                          <div className="shopee-order-shop">
                            <div className="shop-name">
                              <i className="fas fa-store"></i>
                              <span>Sakego</span>
                            </div>
                            <div className="shopee-order-status">
                              {getStatusText(order.status).toUpperCase()}
                            </div>
                          </div>

                          {order.items.map((item, idx) => {
                            const getDisplayImage = (item) => {
                              let displayImage = item.image;
                              if (item.name === 'DOUBLE CHILL') displayImage = '/assets/images/Combo_2chill.png';
                              else if (item.name === 'COUPLE CHILL') displayImage = '/assets/images/combo_2chill.jpg';
                              else if (item.name === 'CHILL MỘT MÌNH') displayImage = '/assets/images/combo_1chilll.png';
                              else if (item.name === 'ÍCH KỶ') displayImage = '/assets/images/combo_ichki.jpg';
                              else if (item.name === 'SAKE PARTY') displayImage = '/assets/images/combo_PT.jpg';
                              else if (item.name === 'Combo Sa Kê Đa Dạng') displayImage = '/assets/images/combo_PT.jpg';
                              return displayImage;
                            };
                            return (
                              <div key={idx} className="shopee-order-product">
                                <img src={getDisplayImage(item)} alt={item.name} onError={(e) => { e.target.src = '/assets/images/default_product.png'; }} />
                                <div className="product-details">
                                  <h4>{item.name}</h4>
                                  <div className="product-meta">
                                    <span>x{item.quantity}</span>
                                  </div>
                                </div>
                                <div className="product-price">
                                  ₫{(item.price || 0).toLocaleString('vi-VN')}
                                </div>
                              </div>
                            );
                          })}

                          <div className="shopee-order-footer">
                            <div className="order-total-price">
                              Thành tiền: <span>₫{order.totalAmount.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="order-actions">
                              {order.status === 'completed' && <button className="btn-shopee btn-repurchase" onClick={() => navigate('/products')}>Mua lại</button>}
                              <button className="btn-shopee btn-contact" onClick={() => setShowContactModal(true)}>Liên hệ Người bán</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3><i className="fas fa-headset"></i> Liên hệ Người bán</h3>
              <button className="contact-modal-close" onClick={() => setShowContactModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="contact-modal-body">
              <p className="contact-modal-desc">Bạn cần hỗ trợ? Hãy liên hệ với chúng tôi qua các kênh bên dưới:</p>
              <div className="contact-item">
                <div className="contact-icon-wrap">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-info">
                  <span className="contact-label">Email</span>
                  <a href="mailto:Sakego25@gmail.com" className="contact-value">Sakego25@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-info">
                  <span className="contact-label">Hotline</span>
                  <a href="tel:0392020136" className="contact-value">039 2020 136</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap">
                  <i className="fab fa-facebook"></i>
                </div>
                <div className="contact-info">
                  <span className="contact-label">Facebook</span>
                  <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="contact-value">Sakego - Trái Sa Kê Tươi</a>
                </div>
              </div>
            </div>
            <div className="contact-modal-footer">
              <a href="mailto:Sakego25@gmail.com" className="btn-send-email">
                <i className="fas fa-paper-plane"></i>
                Gửi email ngay
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
