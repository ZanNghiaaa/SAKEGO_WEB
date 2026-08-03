import React, { useState, useEffect } from 'react';
import {
  getAllOrders,
  updateOrderStatus,
  ORDER_STATUS,
  ORDER_STATUS_TEXT
} from '../controllers/OrderController';

const STATUS_CONFIG = {
  pending:    { label: 'Chờ xác nhận', color: '#f97316', icon: 'fa-clock',        badge: 'status-pending' },
  confirmed:  { label: 'Đã xác nhận',  color: '#3b82f6', icon: 'fa-check',        badge: 'status-confirmed' },
  preparing:  { label: 'Chuẩn bị',     color: '#a855f7', icon: 'fa-box',          badge: 'status-preparing' },
  delivering: { label: 'Đang giao',    color: '#14b8a6', icon: 'fa-truck',        badge: 'status-delivering' },
  completed:  { label: 'Hoàn thành',   color: '#22c55e', icon: 'fa-check-circle', badge: 'status-completed' },
  cancelled:  { label: 'Đã hủy',       color: '#ef4444', icon: 'fa-times-circle', badge: 'status-cancelled' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => {
    window.addEventListener('newNotification', loadOrders);
    return () => window.removeEventListener('newNotification', loadOrders);
  }, []);

  /* Filter & search */
  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !searchTerm ||
      o.customerInfo?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo?.phone?.includes(searchTerm) ||
      String(o.orderNumber || o.id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const countByStatus = (s) => orders.filter(o => o.status === s).length;

  const getStatusClass = (s) => STATUS_CONFIG[s]?.badge || '';

  const handleUpdateStatus = async (orderId, newStatus) => {
    setLoadingId(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      const errMsg = error.message || 'Lỗi không xác định';
      setOrders(prev => prev.map(o =>
        (o.id === orderId || o._id === orderId) ? { ...o, _updateError: errMsg } : o
      ));
      setTimeout(() => setOrders(prev => prev.map(o => ({ ...o, _updateError: undefined }))), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const viewOrderDetail = (order) => { setSelectedOrder(order); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedOrder(null); };

  const getNextStatus = (s) => ({
    [ORDER_STATUS.PENDING]:   ORDER_STATUS.CONFIRMED,
    [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
    [ORDER_STATUS.PREPARING]: ORDER_STATUS.DELIVERING,
    [ORDER_STATUS.DELIVERING]:ORDER_STATUS.COMPLETED,
  }[s]);

  const filterTabs = [
    { key: 'all', label: 'Tất cả', icon: 'fa-th', count: orders.length, color: null },
    { key: ORDER_STATUS.PENDING,    ...STATUS_CONFIG.pending },
    { key: ORDER_STATUS.CONFIRMED,  ...STATUS_CONFIG.confirmed },
    { key: ORDER_STATUS.PREPARING,  ...STATUS_CONFIG.preparing },
    { key: ORDER_STATUS.DELIVERING, ...STATUS_CONFIG.delivering },
    { key: ORDER_STATUS.COMPLETED,  ...STATUS_CONFIG.completed },
    { key: ORDER_STATUS.CANCELLED,  ...STATUS_CONFIG.cancelled },
  ];

  return (
    <div className="admin-orders">
      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1><i className="fas fa-shopping-bag" /> Quản Lý Đơn Hàng</h1>
          <p className="admin-header-subtitle">
            Quản lý và theo dõi {orders.length} đơn hàng của khách hàng
          </p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={loadOrders}>
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* ── Summary mini-cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Tổng đơn',     value: orders.length,              color: '#3b82f6', icon: 'fa-list' },
          { label: 'Chờ xác nhận', value: countByStatus('pending'),   color: '#f97316', icon: 'fa-clock' },
          { label: 'Đang giao',    value: countByStatus('delivering'),color: '#14b8a6', icon: 'fa-truck' },
          { label: 'Hoàn thành',   value: countByStatus('completed'), color: '#22c55e', icon: 'fa-check-circle' },
        ].map((m, i) => (
          <div key={i} style={{
            background: 'white', border: '1px solid var(--admin-border)',
            borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
            transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: `${m.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: m.color, fontSize: 16
            }}>
              <i className={`fas ${m.icon}`} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 500 }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div className="admin-filters">
        <div className="filter-tabs" style={{ flexWrap: 'wrap' }}>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setFilterStatus(tab.key)}
              style={filterStatus === tab.key && tab.color ? {
                background: tab.color, borderColor: tab.color, boxShadow: `0 4px 12px ${tab.color}40`
              } : {}}
            >
              <i className={`fas ${tab.icon}`} />
              <span>{tab.label}</span>
              <span className="count-badge">
                {tab.key === 'all' ? orders.length : countByStatus(tab.key)}
              </span>
            </button>
          ))}
        </div>
        <div className="search-box-admin">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, mã đơn..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>
            <i className="fas fa-list-alt" />
            {filterStatus === 'all' ? 'Tất cả đơn hàng' : `Đơn ${STATUS_CONFIG[filterStatus]?.label || ''}`}
          </h3>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>
            {filteredOrders.length} đơn hàng
          </span>
        </div>
        <div style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12, display: 'block' }} />
              Đang tải dữ liệu...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox" />
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const ordId = order.id || order._id;
                    const isLoading = loadingId === ordId;
                    return (
                      <tr key={ordId}>
                        <td>
                          <span style={{
                            fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                            color: 'var(--green-500)',
                            background: 'rgba(124,179,66,0.1)', padding: '3px 8px', borderRadius: 6
                          }}>
                            #{String(order.orderNumber || ordId).slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%',
                              background: 'linear-gradient(135deg,#7CB342,#558B2F)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0
                            }}>
                              {(order.customerInfo?.fullname || order.customerName || 'K')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: 13 }}>
                                {order.customerInfo?.fullname || order.customerName || '—'}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                                {order.customerInfo?.email || order.customerEmail || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>{order.customerInfo?.phone || '—'}</td>
                        <td>
                          <div style={{
                            fontSize: 12, color: 'var(--admin-text-muted)',
                            maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>
                            {[order.customerInfo?.address, order.customerInfo?.ward, order.customerInfo?.district]
                              .filter(Boolean).join(', ') || '—'}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            background: 'rgba(59,130,246,0.1)', color: '#2563eb',
                            padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700
                          }}>
                            {order.items?.length || 0} món
                          </span>
                        </td>
                        <td>
                          <strong className="text-success" style={{ fontSize: 14 }}>
                            {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                          </strong>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            color: order.paymentMethod === 'cod' ? '#d97706' : '#2563eb',
                            background: order.paymentMethod === 'cod' ? 'rgba(251,191,36,0.1)' : 'rgba(59,130,246,0.1)',
                            padding: '3px 8px', borderRadius: 6
                          }}>
                            {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {ORDER_STATUS_TEXT[order.status]}
                          </span>
                          {order._updateError && (
                            <div className="inline-error" style={{ marginTop: 6 }}>
                              <i className="fas fa-exclamation-circle" />
                              {order._updateError}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                          <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                          <div style={{ fontSize: 11 }}>{new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-action-view"
                              onClick={() => viewOrderDetail(order)}
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye" />
                            </button>
                            {getNextStatus(order.status) && (
                              <button
                                className="btn-action"
                                style={{
                                  background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                                  opacity: isLoading ? 0.5 : 1,
                                  cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => !isLoading && handleUpdateStatus(ordId, getNextStatus(order.status))}
                                title={`→ ${ORDER_STATUS_TEXT[getNextStatus(order.status)]}`}
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? <i className="fas fa-spinner fa-spin" />
                                  : <i className="fas fa-arrow-right" />}
                              </button>
                            )}
                            {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.COMPLETED && (
                              <button
                                className="btn-action btn-action-delete"
                                onClick={() => !isLoading && handleUpdateStatus(ordId, ORDER_STATUS.CANCELLED)}
                                title="Hủy đơn"
                                disabled={isLoading}
                              >
                                <i className="fas fa-times" />
                              </button>
                            )}
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

      {/* ── Order Detail Modal ── */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-receipt" />
                Chi Tiết Đơn Hàng
                <span style={{
                  fontFamily: 'monospace', fontSize: 14,
                  color: 'var(--green-500)', fontWeight: 700, marginLeft: 8
                }}>
                  #{String(selectedOrder.orderNumber || selectedOrder.id).slice(-6).toUpperCase()}
                </span>
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="modal-body">
              {/* Status header */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)',
                borderRadius: 12, padding: '14px 18px', marginBottom: 20,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
              }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: 4 }}>TRẠNG THÁI</div>
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {ORDER_STATUS_TEXT[selectedOrder.status]}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: 4 }}>THANH TOÁN</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>
                      {selectedOrder.paymentMethod === 'cod' ? '💵 COD (Tiền mặt)' : '🏦 Chuyển khoản'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: 4 }}>THỜI GIAN ĐẶT</div>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-dim)' }}>
                      {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
                {/* Quick update select */}
                {selectedOrder.status !== ORDER_STATUS.CANCELLED && selectedOrder.status !== ORDER_STATUS.COMPLETED && (
                  <select
                    className="status-select"
                    value={selectedOrder.status}
                    onChange={e => handleUpdateStatus(selectedOrder.id || selectedOrder._id, e.target.value)}
                  >
                    {Object.entries(ORDER_STATUS_TEXT).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Customer info */}
              <div className="order-detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="order-detail-grid">
                  <div className="order-detail-item">
                    <div className="label">Họ tên</div>
                    <div className="value">{selectedOrder.customerInfo?.fullname || '—'}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">SĐT</div>
                    <div className="value">{selectedOrder.customerInfo?.phone || '—'}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">Email</div>
                    <div className="value" style={{ fontSize: 13 }}>{selectedOrder.customerInfo?.email || '—'}</div>
                  </div>
                  <div className="order-detail-item">
                    <div className="label">Quận / Huyện</div>
                    <div className="value">{selectedOrder.customerInfo?.district || '—'}</div>
                  </div>
                  <div className="order-detail-item" style={{ gridColumn: '1/-1' }}>
                    <div className="label">Địa chỉ giao hàng</div>
                    <div className="value">
                      {[selectedOrder.customerInfo?.address, selectedOrder.customerInfo?.ward, selectedOrder.customerInfo?.district]
                        .filter(Boolean).join(', ')}
                      , Cần Thơ
                    </div>
                  </div>
                  {selectedOrder.customerInfo?.notes && (
                    <div className="order-detail-item" style={{ gridColumn: '1/-1' }}>
                      <div className="label">Ghi chú</div>
                      <div className="value" style={{ color: '#fbbf24' }}>
                        {selectedOrder.customerInfo.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="order-detail-section">
                <h4>Sản phẩm đặt hàng</h4>
                <div className="order-items-list">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <div className="order-item-name">{item.name}</div>
                          <div className="order-item-qty" style={{ marginTop: 3 }}>
                            {item.price?.toLocaleString('vi-VN')}đ × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="order-item-price">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                  <div className="order-total-row">
                    <span className="order-total-label">Tổng cộng</span>
                    <span className="order-total-amount">
                      {(selectedOrder.totalAmount || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Status history */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div className="order-detail-section">
                  <h4>Lịch sử trạng thái</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedOrder.statusHistory.map((h, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--admin-border)', borderRadius: 8
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50', marginTop: 5, flexShrink: 0,
                          background: STATUS_CONFIG[h.status]?.color || '#64748b'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>
                            {ORDER_STATUS_TEXT[h.status]}
                          </div>
                          {h.note && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{h.note}</div>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(h.timestamp).toLocaleString('vi-VN')}
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
                  className="btn-primary"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id || selectedOrder._id, getNextStatus(selectedOrder.status));
                    closeModal();
                  }}
                >
                  <i className="fas fa-arrow-right" />
                  → {ORDER_STATUS_TEXT[getNextStatus(selectedOrder.status)]}
                </button>
              )}
              {selectedOrder.status !== ORDER_STATUS.CANCELLED && selectedOrder.status !== ORDER_STATUS.COMPLETED && (
                <button
                  style={{
                    padding: '10px 20px', background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                    fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id || selectedOrder._id, ORDER_STATUS.CANCELLED);
                    closeModal();
                  }}
                >
                  <i className="fas fa-times" /> Hủy đơn
                </button>
              )}
              <button className="btn-secondary" onClick={closeModal}>
                <i className="fas fa-times" /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
