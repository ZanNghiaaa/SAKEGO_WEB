import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import MarqueeTicker from '../components/MarqueeTicker';
import ProductCard from '../components/ProductCard';
import { fetchProductsFromAPI } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';

/* ── Scroll-reveal hook ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── CountUp component ── */
function CountUp({ end, suffix = '', duration = 2000, trigger = true }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return <span>{count}{suffix}</span>;
}

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [sustainRef, sustainVisible] = useScrollReveal(0.1);
  const [statsRef, statsVisible] = useScrollReveal(0.2);

  useEffect(() => {
    fetchProductsFromAPI().then(data => {
      // Đưa các sản phẩm bán chạy (isBestSeller) lên đầu danh sách sản phẩm nổi bật
      const sorted = [...data]
        .filter(p => !p.isTrial)
        .sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      setFeaturedProducts(sorted.slice(0, 6));
    });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `<i class="fas fa-check-circle"></i> Đã thêm ${product.name} vào giỏ hàng!`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  };

  const sustainPillars = [
    { icon: 'fas fa-seedling',      color: '#4CAF50', title: 'Vùng Trồng Bền Vững',   desc: 'Phát triển 50+ ha vùng trồng sa kê theo tiêu chuẩn VietGAP, không thuốc trừ sâu hóa học.' },
    { icon: 'fas fa-recycle',       color: '#2196F3', title: 'Mô Hình Sinh Kế Bền Vững',      desc: 'Tận dụng 100% phụ phẩm từ quá trình sản xuất — lá, hạt, vỏ đều được tái chế thành phân hữu cơ.' },
    { icon: 'fas fa-users',         color: '#FF9800', title: 'Cộng Đồng Nông Dân',     desc: 'Đồng hành cùng 200+ hộ nông dân miền Tây, đảm bảo thu nhập ổn định và bền vững.' },
    { icon: 'fas fa-solar-panel',   color: '#9C27B0', title: 'Năng Lượng Xanh',        desc: 'Nhà máy chế biến sử dụng 70% điện năng lượng mặt trời, giảm phát thải carbon.' },
    { icon: 'fas fa-water',         color: '#00BCD4', title: 'Bảo Vệ Nguồn Nước',      desc: 'Hệ thống tưới nhỏ giọt tiết kiệm 60% lượng nước so với phương pháp truyền thống.' },
    { icon: 'fas fa-leaf',          color: '#8BC34A', title: 'Chứng Nhận Hữu Cơ',      desc: 'Đạt chứng nhận organic quốc tế, cam kết sạch từ đất đến bàn ăn của gia đình bạn.' },
  ];

  const impactStats = [
    { num: 50,   suffix: '+',  label: 'Ha vùng trồng',     icon: 'fas fa-map-marked-alt' },
    { num: 200,  suffix: '+',  label: 'Hộ nông dân',       icon: 'fas fa-users' },
    { num: 1000, suffix: '+',  label: 'Tấn CO₂ tiết kiệm', icon: 'fas fa-cloud' },
    { num: 70,   suffix: '%',  label: 'Điện tái tạo',      icon: 'fas fa-solar-panel' },
  ];

  // Observe elements to trigger .animate classes
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.feature-card, .category-card');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <HeroSection />
      <CategoriesSection />

      {/* ══════════════════════════════════════
          MARQUEE TICKER
      ══════════════════════════════════════ */}
      <MarqueeTicker />

      {/* ══════════════════════════════════════
          PHÁT TRIỂN BỀN VỮNG SECTION
      ══════════════════════════════════════ */}
      <section className="sustain-section" id="sustainability-home">
        {/* Background decorations */}
        <div className="sustain-bg-deco" aria-hidden="true">
          <div className="sdeco-circle sdeco-c1"></div>
          <div className="sdeco-circle sdeco-c2"></div>
          <div className="sdeco-leaf sdeco-l1"><i className="fas fa-leaf"></i></div>
          <div className="sdeco-leaf sdeco-l2"><i className="fas fa-leaf"></i></div>
          <div className="sdeco-leaf sdeco-l3"><i className="fas fa-seedling"></i></div>
        </div>

        <div className="container">
          {/* Header */}
          <div className="sustain-header" ref={sustainRef}>
            <div className={`sustain-eyebrow${sustainVisible ? ' sv-in' : ''}`}>
              <i className="fas fa-globe-asia"></i>
              Phát Triển Bền Vững
            </div>
            <h2 className={`sustain-title${sustainVisible ? ' sv-in' : ''}`} style={{ transitionDelay: '.15s' }}>
              Gieo Xanh Hôm Nay,<br />
              <span className="sustain-accent">Gặt Tương Lai Bền Vững</span>
            </h2>
            <p className={`sustain-desc${sustainVisible ? ' sv-in' : ''}`} style={{ transitionDelay: '.28s' }}>
              SAKEGO cam kết phát triển ngành sa kê Việt Nam theo hướng bền vững — 
              từ vùng trồng đến bàn ăn, mỗi sản phẩm đều mang theo trách nhiệm với đất, nước và con người.
            </p>
          </div>

          {/* 6 pillars */}
          <div className="sustain-pillars">
            {sustainPillars.map((p, i) => (
              <div
                key={i}
                className={`sustain-card${sustainVisible ? ' sv-in' : ''}`}
                style={{ transitionDelay: `${0.08 * i + 0.35}s` }}
              >
                <div className="sc-icon" style={{ background: `${p.color}18`, color: p.color }}>
                  <i className={p.icon}></i>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="sc-bar" style={{ '--bar-color': p.color }}></div>
              </div>
            ))}
          </div>

          {/* Earth Impact numbers - Modern Full Globe */}
          <div className={`sustain-impact-earth-wrapper${statsVisible ? ' sv-in' : ''}`} ref={statsRef}>
            <div className={`si-label${statsVisible ? ' sv-in' : ''}`}>
              <i className="fas fa-chart-line"></i> Tác động thực tế của SAKEGO
            </div>
            
            <div className="impact-modern-layout">
              {/* SVG Connecting Lines with Data Flow Animation */}
              <svg className="impact-connections" viewBox="0 0 1100 550" preserveAspectRatio="none">
                <path d="M550,275 C400,275 250,150 145,90" className="connection-path" />
                <path d="M550,275 C700,275 850,150 955,90" className="connection-path" />
                <path d="M550,275 C400,275 250,400 145,460" className="connection-path" />
                <path d="M550,275 C700,275 850,400 955,460" className="connection-path" />
                
                {/* Glowing Data Particles */}
                <circle r="5" fill="#7CB342" className="data-particle"><animateMotion dur="3s" repeatCount="indefinite" path="M550,275 C400,275 250,150 145,90" /></circle>
                <circle r="5" fill="#7CB342" className="data-particle"><animateMotion dur="3s" repeatCount="indefinite" begin="0.75s" path="M550,275 C700,275 850,150 955,90" /></circle>
                <circle r="5" fill="#7CB342" className="data-particle"><animateMotion dur="3s" repeatCount="indefinite" begin="1.5s" path="M550,275 C400,275 250,400 145,460" /></circle>
                <circle r="5" fill="#7CB342" className="data-particle"><animateMotion dur="3s" repeatCount="indefinite" begin="2.25s" path="M550,275 C700,275 850,400 955,460" /></circle>
              </svg>

              <div className="impact-globe-center">
                <div className="globe-core"></div>
                <div className="wireframe-globe">
                  {/* Longitudes */}
                  {[...Array(18)].map((_, i) => (
                    <div key={`lon-${i}`} className="wf-lon" style={{ transform: `rotateY(${i * 20}deg)` }}></div>
                  ))}
                  {/* Latitudes */}
                  {[...Array(18)].map((_, i) => {
                    const deg = (i * 10) - 90;
                    const scale = Math.max(0, Math.cos(deg * Math.PI / 180));
                    const y = Math.sin(deg * Math.PI / 180) * 230; 
                    return <div key={`lat-${i}`} className="wf-lat" style={{ transform: `rotateX(90deg) translateZ(${y}px) scale(${scale})` }}></div>
                  })}
                </div>
              </div>

              <div className="impact-stats-grid">
                {impactStats.map((s, i) => (
                  <div key={i} className={`impact-stat-card ${statsVisible ? 'sv-in' : ''}`} style={{ transitionDelay: `${i * 0.15}s` }}>
                    <div className="isc-icon"><i className={s.icon}></i></div>
                    <div className="isc-content">
                      <div className="isc-num">
                        <CountUp end={s.num} suffix={s.suffix} trigger={statsVisible} />
                      </div>
                      <div className="isc-text">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className={`sustain-cta${sustainVisible ? ' sv-in' : ''}`} style={{ animationDelay: '.7s' }}>
            <Link to="/sustainability" className="sustain-btn-primary">
              <i className="fas fa-seedling"></i> Tìm hiểu hành trình xanh
              <span className="btn-shine"></span>
            </Link>
            <Link to="/products" className="sustain-btn-ghost">
              <i className="fas fa-shopping-bag"></i> Mua sản phẩm bền vững
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SẢN PHẨM NỔI BẬT
      ══════════════════════════════════════ */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <span className="featured-tag"><i className="fas fa-star"></i> Nổi bật</span>
            <h2>Sản Phẩm <span className="featured-accent">Bán Chạy</span></h2>
            <p>Những sản phẩm sa kê được yêu thích nhất từ khách hàng SAKEGO</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="featured-card-wrap" style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
          <div className="featured-footer">
            <Link to="/products" className="btn-view-all">
              <i className="fas fa-th"></i> Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
