import React, { useEffect } from 'react';

const Carousel = () => {
  return (
    <section className="carousel-section">
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
            className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-content">
              <h2>Khuyến mãi đặc biệt</h2>
              <p>Giảm giá 20% cho đơn hàng đầu tiên</p>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-content">
              <h2>Về chúng tôi</h2>
              <p>SaKeFruit tự hào cung cấp những trái sa kê tươi ngon nhất, được chọn lọc kỹ càng từ những vườn sa kê uy tín.</p>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-content">
              <h2>Miễn phí vận chuyển</h2>
              <p>Cho đơn hàng từ 500,000đ</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

export default Carousel;
