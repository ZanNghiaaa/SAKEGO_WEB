import React from 'react';

const About = () => {
  return (
    <main>
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="about-hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="about-hero-content">
            <span className="hero-label">
              <i className="fas fa-leaf"></i> Về chúng tôi
            </span>
            <h1 className="hero-title">
              Hành trình <span className="highlight">SAKEGO</span>
            </h1>
            <p className="hero-description">
              Mang trái sa kê tự nhiên Việt Nam đến với mọi người
            </p>
          </div>
        </div>
      </section>

      {/* About Story Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <div className="image-wrapper">
                <img 
                  src="/assets/images/sake-farm.jpg" 
                  alt="Vườn sa kê"
                />
                <div className="image-badge">
                  <i className="fas fa-award"></i>
                  <div>
                    <strong>10+</strong>
                    <span>Năm kinh nghiệm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="story-content">
              <span className="section-label">Câu chuyện</span>
              <h2 className="section-title">
                Khởi đầu từ <span className="highlight">tình yêu</span> với SAKEGO
              </h2>
              <p>
                SAKEGO ra đời từ hành trình tìm lại giá trị của sa kê – khi chính trái sa kê kể lại câu chuyện của mình: quen thuộc, gần gũi, nhưng lại âm thầm bị lãng quên. Trong quá trình khám phá, chúng tôi nhận ra rằng sa kê mang tiềm năng to lớn về dinh dưỡng, hương vị và ứng dụng, nhưng vẫn chưa được đưa ra ánh sáng trong đời sống hiện đại.
              </p>
              <p>
               Chính vì vậy, chúng tôi muốn trở thành người kể câu chuyện cho trái sa kê. Qua SAKEGO, chúng tôi mong đưa sa kê bước ra khỏi khu vườn quê, khoác lên mình diện mạo mới – tiện lợi, hiện đại và phù hợp với nhịp sống hôm nay. Bằng cách biến sa kê thành những sản phẩm dễ tiếp cận, chúng tôi hy vọng nâng tầm giá trị loại nông sản này và đưa nông sản Việt gần hơn với mọi người tiêu dùng hiện đại.
              </p>
              <div className="story-stats">
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <strong>1000+</strong>
                  <span>Khách hàng</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-box"></i>
                  <strong>3</strong>
                  <span>Sản phẩm</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-seedling"></i>
                  <strong>100%</strong>
                  <span>Tự nhiên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Giá trị cốt lõi</span>
            <h2 className="section-title">
              Điều chúng tôi <span className="highlight">cam kết</span>
            </h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Chất lượng hàng đầu</h3>
              <p>
                Cam kết cung cấp sản phẩm sa kê tươi ngon, đảm bảo vệ sinh an toàn 
                thực phẩm theo tiêu chuẩn cao nhất.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Canh tác bền vững</h3>
              <p>
                Áp dụng phương pháp canh tác hữu cơ, bền vững, thân thiện với 
                môi trường và hệ sinh thái.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Tận tâm phục vụ</h3>
              <p>
                Đặt khách hàng làm trọng tâm, cung cấp dịch vụ chuyên nghiệp và 
                tận tình trong từng sản phẩm.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Hợp tác công bằng</h3>
              <p>
                Làm việc trực tiếp với nông dân, đảm bảo giá trị công bằng và 
                phát triển bền vững cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Quy trình</span>
            <h2 className="section-title">
              Từ vườn đến <span className="highlight">bàn ăn</span>
            </h2>
            <p className="section-description">
              Quy trình khép kín đảm bảo chất lượng tốt nhất cho sản phẩm
            </p>
          </div>
          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Trồng trọt</h3>
              <p>Chọn giống tốt, chăm sóc cẩn thận theo tiêu chuẩn hữu cơ</p>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3>Thu hoạch</h3>
              <p>Thu hái đúng độ chín, bảo quản cẩn thận sau thu hoạch</p>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3>Kiểm tra</h3>
              <p>Kiểm tra chất lượng nghiêm ngặt trước khi đóng gói</p>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Giao hàng</h3>
              <p>Vận chuyển nhanh chóng, đảm bảo độ tươi ngon</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
