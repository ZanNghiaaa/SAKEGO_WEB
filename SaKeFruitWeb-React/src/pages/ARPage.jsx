import React from 'react';
import './ARPage.css';

const ARPage = () => {
  return (
    <div className="ar-page">
      <div className="ar-page-header">
        <div className="container">
          <h2><i className="fas fa-cube"></i> Trải Nghiệm AR 3D</h2>
          <p>Khám phá sản phẩm SAKEGO trong không gian thực tế của bạn bằng công nghệ Thực tế Tăng cường (Augmented Reality) từ Google.</p>
        </div>
      </div>

      <div className="container">
        <div className="ar-content-wrapper">
          <div className="ar-info-side">
            <h3>Công nghệ Tương lai cho Trải nghiệm Mua sắm</h3>
            <p>Chúng tôi mang đến công nghệ WebAR xịn xò nhất, giúp bạn có cái nhìn trực quan và chân thực nhất về các sản phẩm của SAKEGO trước khi quyết định mua.</p>
            <ul className="ar-features-list">
              <li><i className="fas fa-check-circle"></i> <strong>Xoay 360°:</strong> Xem chi tiết từng góc cạnh của bao bì.</li>
              <li><i className="fas fa-search-plus"></i> <strong>Phóng to / Thu nhỏ:</strong> Khám phá từng thông tin in trên hộp.</li>
              <li><i className="fas fa-mobile-alt"></i> <strong>Đặt vào không gian thực (Chỉ hỗ trợ Điện thoại):</strong> Kích hoạt camera để "đặt" thử hộp sản phẩm lên bàn làm việc, kệ bếp của nhà bạn với tỷ lệ thật!</li>
            </ul>
            <div className="ar-cta-box">
              <p><em>Bạn đang xem bằng điện thoại?</em> Hãy bấm vào nút <strong>"Xem trong không gian của bạn"</strong> ở góc dưới của mô hình bên cạnh nhé!</p>
            </div>
          </div>
          
          <div className="ar-model-side">
            <div className="ar-model-box">
              <model-viewer
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
                alt="SAKEGO 3D Product Demo"
                shadow-intensity="1"
                camera-controls="true"
                auto-rotate="true"
                ar="true"
                ar-modes="webxr scene-viewer quick-look"
                environment-image="neutral"
                style={{ width: '100%', height: '500px', backgroundColor: '#f9fbe7', borderRadius: '16px' }}
              >
                <button slot="ar-button" className="ar-button-page">
                  <i className="fas fa-cube"></i> Bấm để xem trong không gian thực (AR)
                </button>
              </model-viewer>
              <p className="ar-model-hint"><i className="fas fa-hand-pointer"></i> Dùng tay hoặc chuột để xoay mô hình 3D (Đang hiển thị mẫu demo Bơ 3D)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARPage;
