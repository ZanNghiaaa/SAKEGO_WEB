import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`✅ Cảm ơn bạn đã đăng ký!\n\nEmail: ${email}\n\nChúng tôi sẽ gửi thông tin ưu đãi đến bạn sớm nhất!`);
    setEmail('');
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2><i className="fas fa-envelope"></i> Đăng Ký Nhận Tin</h2>
              <p>Nhận thông tin ưu đãi và sản phẩm mới nhất từ SAKEGO</p>
            </div>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-subscribe">
                <i className="fas fa-paper-plane"></i> Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="contact-info">
              <h3>Liên hệ</h3>
              <p>Email: info@sakefruit.com</p>
              <p>Điện thoại: 039 2020 136</p>
              <p>Địa chỉ: 600, đường Nguyễn Văn Cừ, Phường An Bình, Quận Ninh Kiều, Cần Thơ</p>
            </div>
            <div className="social-links">
              <h3>Kết nối với chúng tôi</h3>
              <a href="https://www.facebook.com/share/1HzpsrKSFq/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Zalo</a>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 SaKeFruit. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
