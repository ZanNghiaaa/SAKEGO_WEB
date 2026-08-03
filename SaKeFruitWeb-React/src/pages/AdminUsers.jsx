import React, { useState, useEffect } from 'react';
import { getUsers } from '../controllers/UserController';
import { getAllOrders } from '../controllers/OrderController';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(getUsers());
      const orders = await getAllOrders();
      setAllOrders(orders);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch = !searchTerm ||
      (u.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').includes(searchTerm);
    return matchRole && matchSearch;
  });

  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  const getUserOrderCount = (userId) => {
    return allOrders.filter(o => {
      const oid = o.userId?._id || o.userId?.id || o.userId;
      return oid === userId || String(oid) === String(userId);
    }).length;
  };

  const getUserTotalSpend = (userId) => {
    return allOrders
      .filter(o => {
        const oid = o.userId?._id || o.userId?.id || o.userId;
        return (oid === userId || String(oid) === String(userId)) && o.status === 'completed';
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    const userId = user._id || user.id;
    const userOrders = allOrders.filter(o => {
      const oid = o.userId?._id || o.userId?.id || o.userId;
      return oid === userId || String(oid) === String(userId);
    });
    setSelectedUserOrders(userOrders);
  };

  const getAvatarColor = (name = '') => {
    const colors = [
      'linear-gradient(135deg,#3b82f6,#1d4ed8)',
      'linear-gradient(135deg,#7CB342,#558B2F)',
      'linear-gradient(135deg,#a855f7,#7c3aed)',
      'linear-gradient(135deg,#f97316,#ea580c)',
      'linear-gradient(135deg,#14b8a6,#0d9488)',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  return (
    <div className="admin-users">
      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1><i className="fas fa-users" /> Quản Lý Người Dùng</h1>
          <p className="admin-header-subtitle">Quản lý tài khoản khách hàng và quản trị viên</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={loadUsers}>
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} /> Làm mới
          </button>
        </div>
      </div>

      {/* ── Stat mini-cards ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        <div className="stat-card stat-card-blue">
          <div className="stat-icon"><i className="fas fa-users" /></div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-icon"><i className="fas fa-user" /></div>
          <div className="stat-content">
            <h3>{totalCustomers}</h3>
            <p>Khách hàng</p>
          </div>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-icon"><i className="fas fa-user-shield" /></div>
          <div className="stat-content">
            <h3>{totalAdmins}</h3>
            <p>Quản trị viên</p>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="admin-filters">
        <div className="filter-tabs">
          {[
            { key: 'all',      label: 'Tất cả',      icon: 'fa-users',       count: users.length },
            { key: 'customer', label: 'Khách hàng',  icon: 'fa-user',        count: totalCustomers },
            { key: 'admin',    label: 'Admin',        icon: 'fa-user-shield', count: totalAdmins },
          ].map(t => (
            <button
              key={t.key}
              className={`filter-tab ${filterRole === t.key ? 'active' : ''}`}
              onClick={() => setFilterRole(t.key)}
            >
              <i className={`fas ${t.icon}`} />
              <span>{t.label}</span>
              <span className="count-badge">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="search-box-admin">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Tìm tên, email, SĐT..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3><i className="fas fa-list" /> Danh sách người dùng</h3>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>
            {filteredUsers.length} người dùng
          </span>
        </div>
        <div style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12, display: 'block' }} />
              Đang tải dữ liệu...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-slash" />
              <p>Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Đơn hàng</th>
                    <th>Chi tiêu</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const orderCount = getUserOrderCount(user._id || user.id);
                    const totalSpend = getUserTotalSpend(user._id || user.id);
                    return (
                      <tr key={user._id || user.id}>
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar-sm" style={{ background: getAvatarColor(user.fullname) }}>
                              {(user.fullname || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="user-info-name">{user.fullname}</div>
                              <div className="user-info-email" style={{ fontSize: 11 }}>
                                #{String(user._id || user.id).slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.05)', padding: '3px 8px',
                            borderRadius: 6, fontFamily: 'monospace', fontSize: 12
                          }}>
                            @{user.username}
                          </span>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--admin-text-dim)' }}>{user.email}</td>
                        <td style={{ fontSize: 13 }}>{user.phone || '—'}</td>
                        <td>
                          {user.role === 'admin' ? (
                            <span className="role-badge role-admin">
                              <i className="fas fa-user-shield" style={{ marginRight: 4 }} />Admin
                            </span>
                          ) : (
                            <span className="role-badge role-customer">
                              <i className="fas fa-user" style={{ marginRight: 4 }} />Khách hàng
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <span style={{
                            background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                            padding: '3px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700
                          }}>
                            {orderCount}
                          </span>
                        </td>
                        <td>
                          <strong className="text-success" style={{ fontSize: 13 }}>
                            {totalSpend > 0 ? `${totalSpend.toLocaleString('vi-VN')}đ` : '—'}
                          </strong>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-action-view"
                              onClick={() => handleViewUser(user)}
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── User Detail Modal ── */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-circle" /> Hồ Sơ Người Dùng</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="modal-body">
              {/* Avatar + name */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
                padding: '20px', background: 'var(--admin-surface-2)',
                border: '1px solid var(--admin-border)', borderRadius: 12
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: getAvatarColor(selectedUser.fullname),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, color: 'white', fontWeight: 800, flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}>
                  {(selectedUser.fullname || 'U')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)' }}>
                    {selectedUser.fullname}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 8 }}>
                    @{selectedUser.username}
                  </div>
                  {selectedUser.role === 'admin' ? (
                    <span className="role-badge role-admin">
                      <i className="fas fa-user-shield" style={{ marginRight: 4 }} />Quản trị viên
                    </span>
                  ) : (
                    <span className="role-badge role-customer">
                      <i className="fas fa-user" style={{ marginRight: 4 }} />Khách hàng
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#4ade80' }}>
                    {getUserOrderCount(selectedUser._id || selectedUser.id)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontWeight: 600 }}>Đơn hàng</div>
                </div>
              </div>

              {/* Info grid */}
              <div className="order-detail-section">
                <h4>Thông tin tài khoản</h4>
                <div className="order-detail-grid">
                  <div className="order-detail-item">
                    <div className="label">Email</div>
                    <div className="value" style={{ fontSize: 13 }}>{selectedUser.email}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">Số điện thoại</div>
                    <div className="value">{selectedUser.phone || '—'}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">Ngày tạo</div>
                    <div className="value">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">Tổng chi tiêu</div>
                    <div className="value" style={{ color: '#4ade80' }}>
                      {getUserTotalSpend(selectedUser._id || selectedUser.id).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  {selectedUser.address && (
                    <div className="order-detail-item" style={{ gridColumn: '1/-1' }}>
                      <div className="label">Địa chỉ</div>
                      <div className="value">{selectedUser.address}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent orders */}
              {selectedUserOrders.length > 0 && (
                <div className="order-detail-section">
                  <h4>Đơn hàng gần đây</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedUserOrders.slice(0, 5).map((o, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px', background: 'var(--admin-surface-2)',
                        border: '1px solid var(--admin-border)', borderRadius: 8
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--admin-text)' }}>
                            #{String(o.orderNumber || o.id).slice(-6).toUpperCase()}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                            {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 13 }}>
                            {(o.totalAmount || 0).toLocaleString('vi-VN')}đ
                          </div>
                          <div style={{
                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            color: o.status === 'completed' ? '#4ade80' : o.status === 'cancelled' ? '#f87171' : '#fbbf24'
                          }}>
                            {o.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                <i className="fas fa-times" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
