import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersStatistics, getTodayOrders, getAllOrders, ORDER_STATUS_TEXT } from '../controllers/OrderController';
import { getUsers } from '../controllers/UserController';
import { getAllProducts } from '../controllers/ProductController';
import { ShoppingCart, Users, Clock, ArrowRight, Inbox, Eye } from 'lucide-react';

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

/* ── Line Chart (Pure SVG) ── */
function LineChart({ data, color, height = 80 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min;
  const width = 400; // viewbox width
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((d.value - min) / (range || 1)) * (height - 10) - 5;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
            style={{ filter: `drop-shadow(0 4px 6px ${color}60)` }} />
    </svg>
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
  const [users, setUsers] = useState([]);
  const products = getAllProducts();

  /* Dynamic Filters */
  const [timeFilter, setTimeFilter] = useState('month'); // today, yesterday, week, month, year, custom
  const [filteredStats, setFilteredStats] = useState({ revenue: 0, orders: 0, newCustomers: 0, pending: 0, oldRevenue: 0, oldOrders: 0, oldCustomers: 0 });
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (loading) return;
    const now = new Date();
    let startDate = new Date();
    let oldStartDate = new Date();
    let oldEndDate = new Date();
    
    // Set time ranges based on filter
    if (timeFilter === 'today') {
      startDate.setHours(0,0,0,0);
      oldStartDate = new Date(startDate); oldStartDate.setDate(oldStartDate.getDate() - 1);
      oldEndDate = new Date(startDate);
    } else if (timeFilter === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1); startDate.setHours(0,0,0,0);
      now.setDate(now.getDate() - 1); now.setHours(23,59,59,999);
      oldStartDate = new Date(startDate); oldStartDate.setDate(oldStartDate.getDate() - 1);
      oldEndDate = new Date(startDate);
    } else if (timeFilter === 'week') {
      const day = startDate.getDay(); const diff = Math.abs(startDate.getDate() - day + (day === 0 ? -6:1));
      startDate.setDate(diff); startDate.setHours(0,0,0,0);
      oldStartDate = new Date(startDate); oldStartDate.setDate(oldStartDate.getDate() - 7);
      oldEndDate = new Date(startDate);
    } else if (timeFilter === 'month') {
      startDate.setDate(1); startDate.setHours(0,0,0,0);
      oldStartDate = new Date(startDate); oldStartDate.setMonth(oldStartDate.getMonth() - 1);
      oldEndDate = new Date(startDate);
    } else if (timeFilter === 'year') {
      startDate.setMonth(0, 1); startDate.setHours(0,0,0,0);
      oldStartDate = new Date(startDate); oldStartDate.setFullYear(oldStartDate.getFullYear() - 1);
      oldEndDate = new Date(startDate);
    } else {
      startDate = new Date(2000, 0, 1); // all time
    }

    // Filter logic
    let rev = 0, ords = 0, newCust = 0;
    let pend = 0, conf = 0, prep = 0, deli = 0, comp = 0, canc = 0;
    let oldRev = 0, oldOrds = 0, oldCust = 0;
    const dailyRev = {};

    allOrders.forEach(o => {
      const d = new Date(o.createdAt);
      if (d >= startDate && d <= now) {
        ords++;
        if (o.status === 'pending') pend++;
        if (o.status === 'confirmed') conf++;
        if (o.status === 'preparing') prep++;
        if (o.status === 'delivering') deli++;
        if (o.status === 'completed') { comp++; rev += (o.totalAmount || 0); }
        if (o.status === 'cancelled') canc++;
        
        // grouping for chart
        const dateStr = d.toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'});
        dailyRev[dateStr] = (dailyRev[dateStr] || 0) + (o.status === 'completed' ? (o.totalAmount||0) : 0);
      } else if (d >= oldStartDate && d < oldEndDate) {
        oldOrds++;
        if (o.status === 'completed') oldRev += (o.totalAmount || 0);
      }
    });

    users.forEach(u => {
      const d = new Date(u.createdAt);
      if (d >= startDate && d <= now) newCust++;
      else if (d >= oldStartDate && d < oldEndDate) oldCust++;
    });

    setFilteredStats({ 
      revenue: rev, orders: ords, newCustomers: newCust, 
      pending: pend, confirmed: conf, preparing: prep, delivering: deli, completed: comp, cancelled: canc, total: ords,
      oldRevenue: oldRev, oldOrders: oldOrds, oldCustomers: oldCust 
    });
    
    // Prepare chart data
    let cData = Object.keys(dailyRev).map(k => ({ label: k, value: dailyRev[k] })).sort((a,b) => {
        const [d1, m1] = a.label.split('/'); const [d2, m2] = b.label.split('/');
        return new Date(`2026-${m1}-${d1}`).getTime() - new Date(`2026-${m2}-${d2}`).getTime();
    });
    
    if (cData.length < 5) {
       cData = [
         {label: 'T1', value: rev*0.1}, {label: 'T2', value: rev*0.4}, {label: 'T3', value: rev*0.2},
         {label: 'T4', value: rev*0.8}, {label: 'T5', value: rev}
       ];
    }
    setChartData(cData);
  }, [timeFilter, allOrders, users, loading]);

  /* Load data */
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, todayData, ordersData, usersData] = await Promise.all([
        getOrdersStatistics(),
        getTodayOrders(),
        getAllOrders(),
        getUsers()
      ]);
      setStats(statsData);
      setTodayOrders(todayData);
      setAllOrders(ordersData);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
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
    { label: 'Chờ xác nhận',  value: filteredStats.pending || 0,    color: '#f97316' },
    { label: 'Đã xác nhận',   value: filteredStats.confirmed || 0,  color: '#3b82f6' },
    { label: 'Chuẩn bị',      value: filteredStats.preparing || 0,  color: '#a855f7' },
    { label: 'Đang giao',     value: filteredStats.delivering || 0, color: '#14b8a6' },
    { label: 'Hoàn thành',    value: filteredStats.completed || 0,  color: '#22c55e' },
    { label: 'Đã hủy',        value: filteredStats.cancelled || 0,  color: '#ef4444' },
  ];

  /* Bar chart data (revenue by status) */
  const barData = [
    { label: 'Chờ', value: filteredStats.pending || 0,    color: '#f97316' },
    { label: 'Xác nhận', value: filteredStats.confirmed || 0, color: '#3b82f6' },
    { label: 'CB', value: filteredStats.preparing || 0, color: '#a855f7' },
    { label: 'Giao', value: filteredStats.delivering || 0, color: '#14b8a6' },
    { label: 'Xong', value: filteredStats.completed || 0,  color: '#22c55e' },
    { label: 'Hủy', value: filteredStats.cancelled || 0,  color: '#ef4444' },
  ];

  const getStatusClass = (status) => ({
    pending: 'status-pending', confirmed: 'status-confirmed',
    preparing: 'status-preparing', delivering: 'status-delivering',
    completed: 'status-completed', cancelled: 'status-cancelled'
  }[status] || '');

  const completionRate = filteredStats.total > 0
    ? Math.round((filteredStats.completed / filteredStats.total) * 100) : 0;

  return (
    <div className="admin-dashboard">
      {/* ── Header & Time Filter ── */}
      <div className="admin-overview-header">
        <div>
          <h1>Tổng quan</h1>
          <p className="admin-header-subtitle">Chào mừng trở lại! Đây là tổng quan hoạt động của bạn.</p>
        </div>
      </div>
      
      <div className="time-filter-bar">
        <div className="time-filter-chips">
          {['today', 'yesterday', 'week', 'month', 'year', 'custom'].map(tf => {
            const labels = { today: 'Hôm nay', yesterday: 'Hôm qua', week: 'Tuần này', month: 'Tháng này', year: 'Năm này', custom: 'Tùy chỉnh' };
            const icons = { custom: 'fa-calendar-alt' };
            return (
              <button 
                key={tf} 
                className={`time-chip ${timeFilter === tf ? 'active' : ''}`}
                onClick={() => setTimeFilter(tf)}
              >
                {icons[tf] && <i className={`fas ${icons[tf]}`} style={{marginRight: '6px'}} />}
                {labels[tf]}
              </button>
            );
          })}
        </div>
        <div className="time-filter-date">
          {new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* ── Main Metrics Row ── */}
      <div className="overview-metrics-row">
        {/* Revenue Card */}
        <div className="overview-metric-card revenue-card">
          <div className="metric-header">
            <span className="metric-title">DOANH THU {
              timeFilter === 'today' ? 'HÔM NAY' :
              timeFilter === 'yesterday' ? 'HÔM QUA' :
              timeFilter === 'week' ? 'TUẦN NÀY' :
              timeFilter === 'month' ? 'THÁNG NÀY' :
              timeFilter === 'year' ? 'NĂM NÀY' : 'TÙY CHỈNH'
            }</span>
            <span className={`metric-pct ${filteredStats.revenue >= filteredStats.oldRevenue ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${filteredStats.revenue >= filteredStats.oldRevenue ? 'up' : 'down'}`} style={{marginRight: '4px'}} />
              {Math.abs(filteredStats.oldRevenue ? Math.round((filteredStats.revenue - filteredStats.oldRevenue) / filteredStats.oldRevenue * 100) : 100)}%
            </span>
          </div>
          <div className="metric-body">
            <div className="metric-value-large">
              {filteredStats.revenue.toLocaleString('vi-VN')} <u>đ</u>
            </div>
            <div className="metric-icon-bg">
              <i className="fas fa-dollar-sign"/>
            </div>
          </div>
          <div className="metric-chart">
            <LineChart data={chartData} color="#8b5cf6" height={70} />
          </div>
        </div>

        {/* Orders Card */}
        <div className="overview-metric-card">
          <div className="metric-header">
            <div className="metric-icon-small" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <ShoppingCart size={18}  />
            </div>
            <span className={`metric-pct ${filteredStats.orders >= filteredStats.oldOrders ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${filteredStats.orders >= filteredStats.oldOrders ? 'up' : 'down'}`} style={{marginRight: '4px'}} />
              {Math.abs(filteredStats.oldOrders ? Math.round((filteredStats.orders - filteredStats.oldOrders) / filteredStats.oldOrders * 100) : 100)}%
            </span>
          </div>
          <div className="metric-body" style={{ marginTop: 'auto' }}>
            <div className="metric-value">{filteredStats.orders}</div>
            <div className="metric-label">Đơn hàng</div>
            <div className="metric-sublabel" style={{ color: '#d97706' }}>
              {filteredStats.pending} chờ xử lý
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="overview-metric-card">
          <div className="metric-header">
            <div className="metric-icon-small" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Users size={18}  />
            </div>
            <span className={`metric-pct ${filteredStats.newCustomers >= filteredStats.oldCustomers ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${filteredStats.newCustomers >= filteredStats.oldCustomers ? 'up' : 'down'}`} style={{marginRight: '4px'}} />
              {Math.abs(filteredStats.oldCustomers ? Math.round((filteredStats.newCustomers - filteredStats.oldCustomers) / filteredStats.oldCustomers * 100) : 100)}%
            </span>
          </div>
          <div className="metric-body" style={{ marginTop: 'auto' }}>
            <div className="metric-value">{filteredStats.newCustomers}</div>
            <div className="metric-label">Khách hàng mới</div>
            <div className="metric-sublabel">
              {users.length} tổng cộng
            </div>
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
              Tổng: {filteredStats.total || 0} đơn
            </span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="donut-wrapper">
                <DonutChart data={donutData} total={filteredStats.total || 0} size={160} />
                <div className="donut-center">
                  <div className="donut-center-number">{filteredStats.total || 0}</div>
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
                      {filteredStats.total > 0 ? `${Math.round(d.value / filteredStats.total * 100)}%` : '0%'}
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
                { label: 'Đang giao', value: filteredStats.delivering || 0, color: '#14b8a6' },
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



      {/* ── Recent Orders Table ── */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3><Clock size={18}  /> Đơn Hàng Gần Đây</h3>
          <Link to="/admin/orders" className="view-all-link">
            Xem tất cả <ArrowRight size={18}  />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recentOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: 48 }}>
              <Inbox size={18}  />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th className="hide-on-mobile">SĐT</th>
                    <th className="hide-on-mobile">Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th className="hide-on-mobile">Thời gian</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td data-label="Mã đơn">
                        <strong style={{ color: 'var(--green-500)', fontFamily: 'monospace', fontSize: 12 }}>
                          #{String(order.orderNumber || order.id).slice(-6).toUpperCase()}
                        </strong>
                      </td>
                      <td data-label="Khách hàng">
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
                      <td className="hide-on-mobile" data-label="SĐT" style={{ fontSize: 12 }}>{order.customerInfo?.phone || '—'}</td>
                      <td className="hide-on-mobile" data-label="Sản phẩm" style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {(order.items?.length || 0)} sản phẩm
                      </td>
                      <td data-label="Tổng tiền">
                        <strong className="text-success">
                          {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                        </strong>
                      </td>
                      <td data-label="Trạng thái">
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {ORDER_STATUS_TEXT[order.status]}
                        </span>
                      </td>
                      <td className="hide-on-mobile" data-label="Thời gian" style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td data-label="Chi tiết">
                        <Link to="/admin/orders" className="btn-action btn-action-view" title="Xem đơn hàng">
                          <Eye size={18}  />
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
