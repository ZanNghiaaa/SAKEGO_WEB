import React, { useState } from 'react';
import MarqueeTicker from '../components/MarqueeTicker';

const teamStories = [

  {
    name: 'Trần Thị Loan Anh',
    role: 'Phát triển vùng trồng',
    image: '/assets/images/LoanAnh.png',
    icon: 'fas fa-seedling',
    story: 'Mình làm việc trực tiếp với nông hộ để chuẩn hóa quy trình canh tác. Câu chuyện của mình là tạo vùng nguyên liệu ổn định và bền vững từ gốc.'
  },
  {
    name: 'Nguyễn Văn Nghĩa',
    role: 'Nghiên cứu thị trường',
    image: '/assets/images/Nghia.png',
    icon: 'fas fa-chart-line',
    story: 'Mình đi khảo sát và nhận ra nhiều người chưa hiểu hết giá trị của sa kê. Câu chuyện của mình là lắng nghe thị trường để kể lại câu chuyện sa kê đúng cách.'
  },
  {
    name: 'Trương Tử Hoài Ngọc',
    role: 'Nhóm trưởng - Chiến lược sản phẩm',
    image: '/assets/images/HoaiNgoc.png',
    icon: 'fas fa-compass',
    story: 'Mình bắt đầu với mong muốn biến sa kê thành một sản phẩm gần gũi với người trẻ. Câu chuyện của mình là kết nối truyền thống với tư duy sản phẩm hiện đại.'
  },
  {
    name: 'Phạm Thị Anh Thư',
    role: 'Thiết kế thương hiệu',
    image: '/assets/images/Thu.png',
    icon: 'fas fa-pen-ruler',
    story: 'Mình muốn mỗi điểm chạm thương hiệu đều truyền cảm hứng xanh. Câu chuyện của mình là làm cho sa kê trở nên đẹp, dễ nhớ và đáng tin.'
  },
  {
    name: 'Phạm Duy Phương',
    role: 'Vận hành và chất lượng',
    image: '/assets/images/Phuong.png',
    icon: 'fas fa-shield-alt',
    story: 'Mình tập trung vào tiêu chuẩn chất lượng từ thu hoạch đến đóng gói. Câu chuyện của mình là giữ lời hứa về sự an toàn và nhất quán cho khách hàng.'
  }
];

const About = () => {
  const [activeTeamIndex, setActiveTeamIndex] = useState(null);

  return (
    <main>
      {/* About Hero Section */}
      <section className="about-hero about-hero-bg">
        <div className="about-hero-bg-overlay"></div>

        {/* Floating particles */}
        <div className="about-hero-particles">
          <span className="ahp-dot ahp-dot-1"></span>
          <span className="ahp-dot ahp-dot-2"></span>
          <span className="ahp-dot ahp-dot-3"></span>
          <span className="ahp-dot ahp-dot-4"></span>
          <span className="ahp-ring ahp-ring-1"></span>
          <span className="ahp-ring ahp-ring-2"></span>
        </div>

        <div className="container">
          <div className="about-hero-content about-hero-content-left">
            <span className="hero-label about-hero-label-anim">
              <i className="fas fa-leaf"></i> Về chúng tôi
            </span>
            <h1 className="hero-title about-hero-title-anim">
              Hành trình <span className="highlight">SAKEGO</span>
            </h1>
            <p className="hero-description about-hero-desc-anim">
              Mang trái sa kê tự nhiên Việt Nam đến với mọi người
            </p>
            <div className="about-hero-badges about-hero-badges-anim">
              <span className="about-hero-badge">
                <i className="fas fa-leaf"></i> 100% Tự nhiên
              </span>
              <span className="about-hero-badge">
                <i className="fas fa-seedling"></i> Nông sản Việt
              </span>
              <span className="about-hero-badge">
                <i className="fas fa-heart"></i> Tận tâm
              </span>
            </div>
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

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Team Stories Section */}
      <section className="team-stories-section">
        <div className="container">
          <div className="section-header team-stories-header">
            <span className="section-label">Đội ngũ SAKEGO</span>
            <h2 className="section-title">
              5 thành viên, 5 <span className="highlight">câu chuyện đồng hành</span>
            </h2>
            <p className="section-description">
              Mỗi thành viên mang một góc nhìn riêng, cùng chung mục tiêu phát triển giá trị
              bền vững cho cây sa kê Việt.
            </p>
          </div>

          <div className="team-accordion">
            {teamStories.map((member, index) => (
              <div
                className={`team-acc-item ${activeTeamIndex === index ? 'active' : ''}`}
                key={member.name}
                onClick={() => setActiveTeamIndex(activeTeamIndex === index ? null : index)}
              >
                <img src={member.image} alt={member.name} />
                <div className="team-acc-content">
                  <div className="team-acc-icon">
                    <i className={member.icon}></i>
                  </div>
                  <div className="team-acc-info">
                    <h3>{member.name}</h3>
                    <span className="team-acc-role">{member.role}</span>
                    <p className="team-acc-story">"{member.story}"</p>
                  </div>
                </div>
              </div>
            ))}
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
