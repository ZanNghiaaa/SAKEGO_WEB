import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarqueeTicker from '../components/MarqueeTicker';

const Sustainability = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll(
      '.sol-anim'
    );
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="thuc-trang-hero">
        <div className="thuc-trang-hero-background">
          <div className="thuc-trang-overlay"></div>
        </div>

        {/* Leaf particles */}
        <div className="thuc-trang-particles" aria-hidden="true">
          <span className="tt-leaf tt-leaf-1"><i className="fas fa-leaf"></i></span>
          <span className="tt-leaf tt-leaf-2"><i className="fas fa-leaf"></i></span>
          <span className="tt-leaf tt-leaf-3"><i className="fas fa-leaf"></i></span>
          <span className="tt-leaf tt-leaf-4"><i className="fas fa-leaf"></i></span>
        </div>

        {/* Orbiting rings */}
        <div className="tt-ring tt-ring-1" aria-hidden="true"></div>
        <div className="tt-ring tt-ring-2" aria-hidden="true"></div>

        <div className="container">
          <div className="thuc-trang-hero-content">
            <span className="thuc-trang-label">
              <i className="fas fa-chart-line"></i> Thực trạng và giải pháp
            </span>
            <h1 className="thuc-trang-title">
              <span className="green">Sa kê Việt</span> — Gieo giá trị xanh, dựng tương lai bền vững
            </h1>
            <p className="thuc-trang-description">
              Phát triển vùng trồng · Lan tỏa giá trị · Đồng hành cùng cộng đồng xanh
            </p>
            <div className="thuc-trang-actions tt-actions-anim">
              <Link to="/products" className="thuc-btn thuc-btn-primary">
                <i className="fas fa-shopping-bag"></i> Khám phá ngay
              </Link>
              <Link to="/contact" className="thuc-btn thuc-btn-secondary">
                <i className="fas fa-envelope"></i> Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real Situation Section */}
      <section className="situation-section">
        <div className="container">
          <div className="situation-shell">
            <div className="situation-copy">
              <span className="section-label">Thực trạng</span>
              <h2 className="section-title">
                Cây sa kê vẫn còn <span className="highlight">chưa được biết đến rộng rãi</span>
              </h2>
              <p>
                Dù là một loại trái cây giàu giá trị dinh dưỡng và có tiềm năng ứng dụng cao,
                cây sa kê vẫn chưa thật sự xuất hiện nhiều trong thói quen tiêu dùng hiện đại.
                Không ít người chỉ biết sa kê ở mức độ rất hạn chế, thiếu thông tin về cách dùng,
                giá trị sức khỏe và khả năng phát triển vùng trồng bài bản.
              </p>
              <p>
                Vì vậy, SAKEGO chọn cách kể lại câu chuyện của sa kê theo một ngôn ngữ mới:
                gần gũi hơn, trực quan hơn và có tính trải nghiệm cao hơn để đưa trái cây này
                đến gần người tiêu dùng trẻ, gia đình trẻ và thị trường nông sản hiện đại.
              </p>

              <div className="situation-facts">
                <div className="situation-fact">
                  <strong>Nhận diện thấp</strong>
                  <span>Ít xuất hiện trong đời sống hằng ngày</span>
                </div>
                <div className="situation-fact">
                  <strong>Thiếu hệ sinh thái</strong>
                  <span>Chưa có nhiều sản phẩm và câu chuyện thương hiệu</span>
                </div>
                <div className="situation-fact">
                  <strong>Tiềm năng lớn</strong>
                  <span>Phù hợp xu hướng nông sản sạch và bản địa</span>
                </div>
              </div>
            </div>

            <div className="situation-visual">
              <div className="situation-badge">
                <i className="fas fa-chart-line"></i>
                <span>Awareness Gap</span>
              </div>
              <div className="situation-card situation-card-main">
                <div className="situation-card-top">
                  <span className="situation-pill">01</span>
                  <h3>Sa kê chưa phổ biến như các loại trái cây quen thuộc</h3>
                </div>
                <p>
                  Đây vừa là thách thức truyền thông, vừa là cơ hội để xây dựng một dòng
                  sản phẩm có câu chuyện và bản sắc riêng.
                </p>
              </div>
              <div className="situation-card situation-card-floating">
                <i className="fas fa-leaf"></i>
                <div>
                  <strong>Giá trị bản địa</strong>
                  <span>Cần được kể bằng ngôn ngữ hiện đại</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Environment & Sustainability Section */}
      <section className="environment-section">
        <div className="container">
          <div className="section-header environment-header">
            <span className="section-label">Môi trường và vùng trồng</span>
            <h2 className="section-title">
              Nền tảng tự nhiên cho <span className="highlight">SAKEGO</span>
            </h2>
            <p className="section-description">
              Chúng tôi xây dựng vùng nguyên liệu theo hướng thích ứng khí hậu,
              bảo vệ đất, tiết kiệm tài nguyên và tạo giá trị lâu dài cho nông dân.
            </p>
          </div>

          <div className="environment-grid">
            <div className="environment-card environment-card-featured">
              <div className="environment-card-header">
                <div className="environment-icon">
                  <i className="fas fa-cloud-sun"></i>
                </div>
                <div>
                  <span className="environment-eyebrow">Điều kiện sinh trưởng</span>
                  <h3>Khí hậu phù hợp cho cây sa kê</h3>
                </div>
              </div>
              <p>
                Cây sa kê phát triển tốt trong khí hậu nhiệt đới ẩm, nhiều nắng,
                lượng mưa ổn định và đất tơi xốp thoát nước tốt. Đây là lợi thế
                để hình thành vùng trồng ổn định, ít phụ thuộc hóa chất và dễ
                triển khai canh tác sinh thái.
              </p>
              <div className="environment-tags">
                <span><i className="fas fa-sun"></i> Nhiều ánh sáng</span>
                <span><i className="fas fa-water"></i> Thoát nước tốt</span>
                <span><i className="fas fa-seedling"></i> Đất giàu hữu cơ</span>
              </div>
            </div>

            <div className="environment-card">
              <div className="environment-card-header">
                <div className="environment-icon accent-green">
                  <i className="fas fa-recycle"></i>
                </div>
                <div>
                  <span className="environment-eyebrow">Phát triển bền vững</span>
                  <h3>Canh tác tuần hoàn, giảm tác động môi trường</h3>
                </div>
              </div>
              <ul className="sustainable-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  Ưu tiên phân hữu cơ, hạn chế thuốc hóa học và bảo vệ hệ sinh thái đất.
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Tối ưu tưới tiêu, thu gom phụ phẩm và giảm lãng phí sau thu hoạch.
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Gắn kết nông dân, chia sẻ kỹ thuật và tạo sinh kế ổn định lâu dài.
                </li>
              </ul>
            </div>

            <div className="environment-card region-card">
              <div className="environment-card-header">
                <div className="environment-icon accent-gold">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <div>
                  <span className="environment-eyebrow">Vùng trồng</span>
                  <h3>Ưu tiên khu vực canh tác tại Đồng bằng sông Cửu Long</h3>
                </div>
              </div>
              <p>
                Sa kê phù hợp với các vùng đất phù sa, khí hậu ấm và độ ẩm cao.
                Vì vậy, vùng trồng của SAKEGO tập trung vào những khu vực có lợi
                thế nông nghiệp, đặc biệt là Đồng bằng sông Cửu Long.
              </p>
              <div className="region-pills">
                <span>Vũng Tàu</span>
                <span>Lâm Đồng</span>
                <span>Bến Tre</span>
              </div>
            </div>
          </div>

          <div className="environment-quote">
            <i className="fas fa-quote-left"></i>
            <p>
              Chúng tôi không chỉ bán trái sa kê, mà còn xây dựng một hệ sinh thái
              canh tác có trách nhiệm với đất, với người trồng và với tương lai.
            </p>
          </div>
        </div>
      </section>

      {/* SAKEGO Solutions Section - Dynamic Redesign */}
      <section className="solutions-section">
        {/* Artistic Background Elements */}
        <div className="sol-art-bg" aria-hidden="true">
          <div className="art-glow art-glow-1"></div>
          <div className="art-glow art-glow-2"></div>
          <div className="art-glow art-glow-3"></div>
        </div>

        <div className="container relative z-10">
          <div className="section-header sol-header">
            <span className="section-label sol-anim">Giải pháp SAKEGO</span>
            <h2 className="section-title sol-anim">
              Cách chúng tôi <span className="highlight">thay đổi cục diện</span>
            </h2>
            <p className="section-description sol-anim">
              Từ những trăn trở về thực trạng, SAKEGO mang đến các giải pháp toàn diện 
              để đánh thức tiềm năng của cây sa kê Việt Nam, cân bằng giá trị hiện đại.
            </p>
          </div>

          <div className="solutions-grid">
            {/* Solution 1 */}
            <div className="sol-card sol-anim" style={{ transitionDelay: '0.1s' }}>
              <div className="sol-card-inner">
                <div className="sol-icon">
                  <i className="fas fa-box-open"></i>
                </div>
                <h3>Sản phẩm tiện lợi</h3>
                <p>
                  Đa dạng hóa các dòng sản phẩm chế biến sẵn từ sa kê, 
                  giúp khách hàng trẻ và gia đình hiện đại dễ dàng tiếp cận mỗi ngày.
                </p>
                <div className="sol-bar"><span style={{ width: '85%' }}></span></div>
                <small>Trọng tâm: Tiện lợi, Dinh dưỡng</small>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="sol-card sol-anim" style={{ transitionDelay: '0.3s' }}>
              <div className="sol-card-inner">
                <div className="sol-icon">
                  <i className="fas fa-route"></i>
                </div>
                <h3>Chuẩn hóa quy trình</h3>
                <p>
                  Xây dựng chuỗi cung ứng khép kín từ vùng trồng đến nhà máy, 
                  áp dụng tiêu chuẩn khắt khe để đảm bảo chất lượng tuyệt đối.
                </p>
                <div className="sol-bar"><span style={{ width: '92%' }}></span></div>
                <small>Trọng tâm: Khép kín, Chất lượng</small>
              </div>
            </div>

            {/* Solution 3 */}
            <div className="sol-card sol-anim" style={{ transitionDelay: '0.5s' }}>
              <div className="sol-card-inner">
                <div className="sol-icon">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <h3>Nâng tầm thương hiệu</h3>
                <p>
                  Thiết kế hiện đại, bao bì bắt mắt cùng thông điệp xanh 
                  giúp thay đổi hoàn toàn góc nhìn về một loại nông sản truyền thống.
                </p>
                <div className="sol-bar"><span style={{ width: '88%' }}></span></div>
                <small>Trọng tâm: Hình ảnh, Lan tỏa</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Sustainability;