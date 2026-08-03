import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersStatistics, getTodayOrders, getAllOrders, ORDER_STATUS_TEXT } from '../controllers/OrderController';
import { getUsers } from '../controllers/UserController';
import { getAllProducts } from '../controllers/ProductController';

/* ── Animated number counter ── */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

/* ── Donut Chart (pure SVG) ── */
function DonutChart({ data, total, size = 160 }) {
  const R = 56, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * R;
  let offset = 0;

  const segments = data.filter(d => d.value > 0).map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const seg = { ...d, dash, gap, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth="18"
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
          style={{
            filter: `drop-shadow(0 0 6px ${seg.color}60)`,
            transition: 'stroke-dasharray 1s ease'
          }}
        />
      ))}
    </svg>
  );
}

/* ── Bar Chart (pure CSS) ── */
function BarChart({ data }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div className="bar-chart-col" key={i}>
            <div className="bar-val">{d.value}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  height: animated ? `${Math.max(pct, 4)}%` : '0%',
                  background: d.color,
                  transition: `height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
                  boxShadow: `0 0 12px ${d.color}60`
                }}
              />
            </div>
            <div className="bar-label">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0, pending: 0, confirmed: 0, preparing: 0,
    delivering: 0, completed: 0, cancelled: 0, totalRevenue: 0
  });
  const [todayOrders, setTodayOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const users = getUsers();
  const products = getAllProducts();

  /* Load data */
  const loadData = async () => {
    setLoading(true);
    const [statsData, todayData, ordersData] = await Promise.all([
      getOrdersStatistics(),
      getTodayOrders(),
      getAllOrders()
    ]);
    setStats(statsData);
    setTodayOrders(todayData);
    setAllOrders(ordersData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    window.addEventListener('newNotification', loadData);
    return () => window.removeEventListener('newNotification', loadData);
  }, []);

  /* Animated counters */
  const cntTotal = useCountUp(stats.total);
  const cntPending = useCountUp(stats.pending);
  const cntCompleted = useCountUp(stats.completed);
  const cntRevenue = useCountUp(stats.totalRevenue);

  /* Recent orders */
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  /* Donut chart data */
  const donutData = [
    { label: 'Chờ xác nhận',  value: stats.pending,    color: '#f97316' },
    { label: 'Đã xác nhận',   value: stats.confirmed,  color: '#3b82f6' },
    { label: 'Chuẩn bị',      value: stats.preparing,  color: '#a855f7' },
    { label: 'Đang giao',     value: stats.delivering, color: '#14b8a6' },
    { label: 'Hoàn thành',    value: stats.completed,  color: '#22c55e' },
    { label: 'Đã hủy',        value: stats.cancelled,  color: '#ef4444' },
  ];

  /* Bar chart data (revenue by status) */
  const barData = [
    { label: 'Chờ', value: stats.pending,    color: '#f97316' },
    { label: 'Xác nhận', value: stats.confirmed, color: '#3b82f6' },
    { label: 'CB', value: stats.preparing, color: '#a855f7' },
    { label: 'Giao', value: stats.delivering, color: '#14b8a6' },
    { label: 'Xong', value: stats.completed,  color: '#22c55e' },
    { label: 'Hủy', value: stats.cancelled,  color: '#ef4444' },
  ];

  const getStatusClass = (status) => ({
    pending: 'status-pending', confirmed: 'status-confirmed',
    preparing: 'status-preparing', delivering: 'status-delivering',
    completed: 'status-completed', cancelled: 'status-cancelled'
  }[status] || '');

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-chart-line" />
            Tổng Quan
          </h1>
          <p className="admin-header-subtitle">
            Chào mừng quay trở lại! Đây là tổng quan hoạt động kinh doanh của bạn.
          </p>
        </div>
        <div className="admin-header-actions">
          <div className="today-date">
            <i className="fas fa-calendar-alt" />
            <span>{new Date().toLocaleDateString('vi-VN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>
          <button
            className="btn-primary"
            onClick={loadData}
            style={{ padding: '10px 14px' }}
            title="Làm mới dữ liệu"
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        {/* Total orders */}
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number-animate">{cntTotal.toLocaleString('vi-VN')}</h3>
            <p>Tổng đơn hàng</p>
            <span className="stat-subtext">
              <i className="fas fa-clock" />
              Hôm nay: {todayOrders.length} đơn
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number-animate">{cntPending.toLocaleString('vi-VN')}</h3>
            <p>Chờ xác nhận</p>
            {stats.pending > 0 ? (
              <Link to="/admin/orders" className="stat-action">
                Xem ngay <i className="fas fa-arrow-right" />
              </Link>
            ) : (
              <span className="stat-subtext" style={{ color: '#4ade80' }}>
                <i className="fas fa-check-circle" /> Đã xử lý hết
              </span>
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <i className="fas fa-check-circle" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number-animate">{cntCompleted.toLocaleString('vi-VN')}</h3>
            <p>Đã hoàn thành</p>
            <span className="stat-subtext">
              <i className="fas fa-percentage" />
              {completionRate}% tỉ lệ thành công
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card stat-card-purple">
          <div className="stat-icon">
            <i className="fas fa-coins" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number-animate" style={{ fontSize: stats.totalRevenue > 999999 ? '22px' : '30px' }}>
              {cntRevenue.toLocaleString('vi-VN')}đ
            </h3>
            <p>Doanh thu</p>
            <span className="stat-subtext">
              <i className="fas fa-chart-line" />
              Từ {stats.completed} đơn hoàn thành
            </span>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="dashboard-row">
        {/* Donut Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><i className="fas fa-chart-pie" /> Tình Trạng Đơn Hàng</h3>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 600 }}>
              Tổng: {stats.total} đơn
            </span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="donut-wrapper">
                <DonutChart data={donutData} total={stats.total} size={160} />
                <div className="donut-center">
                  <div className="donut-center-number">{stats.total}</div>
                  <div className="donut-center-label">Đơn hàng</div>
                </div>
              </div>
              <div className="donut-legend">
                {donutData.map((d, i) => (
                  <div className="legend-item" key={i}>
                    <span className="legend-dot" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}80` }} />
                    <span className="legend-label">{d.label}</span>
                    <span className="legend-count">{d.value}</span>
                    <span className="legend-pct">
                      {stats.total > 0 ? `${Math.round(d.value / stats.total * 100)}%` : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><i className="fas fa-chart-bar" /> Phân Tích Đơn Hàng</h3>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 600 }}>
              Theo trạng thái
            </span>
          </div>
          <div className="card-body">
            <BarChart data={barData} />
            {/* Quick metrics */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 20
            }}>
              {[
                { label: 'Tỉ lệ HT', value: `${completionRate}%`, color: '#22c55e' },
                { label: 'TB/ngày', value: todayOrders.length, color: '#3b82f6' },
                { label: 'Đang giao', value: stats.delivering, color: '#14b8a6' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)',
                  borderRadius: 8, padding: '10px 12px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats + Products + Users ── */}
      <div className="dashboard-row">
        {/* Quick Stats */}
        <div className="dashboard-card quick-stats-card">
          <div className="card-header">
            <h3><i className="fas fa-tachometer-alt" /> Thống Kê Nhanh</h3>
          </div>
          <div className="card-body">
            {[
              { icon: 'fa-box', bg: 'linear-gradient(135deg,#7CB342,#558B2F)', label: 'Sản phẩm', value: products.length, glow: 'rgba(124,179,66,0.3)' },
              { icon: 'fa-users', bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', label: 'Khách hàng', value: users.filter(u => u.role === 'customer').length, glow: 'rgba(59,130,246,0.3)' },
              { icon: 'fa-truck', bg: 'linear-gradient(135deg,#14b8a6,#0d9488)', label: 'Đang giao', value: stats.delivering, glow: 'rgba(20,184,166,0.3)' },
              { icon: 'fa-ban', bg: 'linear-gradient(135deg,#ef4444,#dc2626)', label: 'Đã hủy', value: stats.cancelled, glow: 'rgba(239,68,68,0.3)' },
            ].map((item, i) => (
              <div className="quick-stat-item" key={i}>
                <div className="quick-stat-icon-box" style={{ background: item.bg, boxShadow: `0 4px 14px ${item.glow}` }}>
                  <i className={`fas ${item.icon}`} />
                </div>
                <div className="quick-stat-info">
                  <h4>{item.value}</h4>
                  <p>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><i className="fas fa-coins" /> Doanh Thu</h3>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 6 }}>Tổng doanh thu</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#7CB342', letterSpacing: -1 }}>
                {stats.totalRevenue.toLocaleString('vi-VN')}đ
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Từ đơn hoàn thành', value: stats.totalRevenue, pct: 100, color: '#22c55e' },
                { label: 'Đơn đang xử lý', value: stats.pending * 50000, pct: Math.round(stats.pending / Math.max(stats.total, 1) * 100), color: '#f97316' },
              ].map((r, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${r.pct}%`, background: r.color,
                      borderRadius: 3, transition: 'width 1s ease',
                      boxShadow: `0 0 8px ${r.color}60`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3><i className="fas fa-clock" /> Đơn Hàng Gần Đây</h3>
          <Link to="/admin/orders" className="view-all-link">
            Xem tất cả <i className="fas fa-arrow-right" />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: 48 }}>
              <i className="fas fa-inbox" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ color: 'var(--green-500)', fontFamily: 'monospace', fontSize: 12 }}>
                          #{String(order.orderNumber || order.id).slice(-6).toUpperCase()}
                        </strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#7CB342,#558B2F)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0
                          }}>
                            {(order.customerInfo?.fullname || order.customerName || 'K')[0].toUpperCase()}
                          </div>
                          <span style={{ color: 'var(--admin-text)', fontWeight: 600, fontSize: 13 }}>
                            {order.customerInfo?.fullname || order.customerName || '—'}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{order.customerInfo?.phone || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {(order.items?.length || 0)} sản phẩm
                      </td>
                      <td>
                        <strong className="text-success">
                          {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                        </strong>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {ORDER_STATUS_TEXT[order.status]}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <Link to="/admin/orders" className="btn-action btn-action-view" title="Xem đơn hàng">
                          <i className="fas fa-eye" />
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
