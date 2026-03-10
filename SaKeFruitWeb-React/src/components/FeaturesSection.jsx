import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>100% Tự Nhiên</h3>
            <p>Không chất bảo quản, không hóa chất</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Giao Hàng Nhanh</h3>
            <p>Miễn phí vận chuyển cho đơn từ 50K</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>An Toàn & Chất Lượng</h3>
            <p>Đảm bảo nguồn gốc xuất xứ rõ ràng</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Hỗ Trợ 24/7</h3>
            <p>Luôn sẵn sàng tư vấn và hỗ trợ</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
