import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-shapes">
          <span className="shape shape-1"></span>
          <span className="shape shape-2"></span>
          <span className="shape shape-3"></span>
        </div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-label">🌿 100% Tự Nhiên</span>
            <h1 className="hero-title">
              SAKEGO Nguyên Chất<br />
              <span className="highlight">Hương Vị Việt Nam</span>
            </h1>
            <p className="hero-description">
              Khám phá hương vị độc đáo từ trái sa kê - đặc sản vùng đất phương Nam. 
              Sản phẩm chất lượng cao, an toàn và giàu dinh dưỡng.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary-hero">
                <i className="fas fa-shopping-bag"></i> Khám phá ngay
              </Link>
              <a href="#trial-section" className="btn btn-secondary-hero">
                <i className="fas fa-gift"></i> Dùng thử miễn phí
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Khách hàng</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Sản phẩm</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Tự nhiên</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <img src="/assets/images/anhbia.png" alt="Sa Kê" />
            </div>
            <div className="floating-card card-2">
              <div className="badge-quality">
                <i className="fas fa-shield-alt"></i>
                <span>Chất lượng<br />cao</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
