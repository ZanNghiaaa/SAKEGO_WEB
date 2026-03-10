import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('ogExQkHNH2O6_vHj3');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS configuration
    const serviceID = 'service_l0u0fer';
    const templateID = 'template_t2gxwg9';

    // Template parameters - Đảm bảo khớp với template trên EmailJS
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone || 'Không cung cấp',
      subject: formData.subject || 'Liên hệ chung',
      message: formData.message
    };

    console.log('📤 Sending email with params:', {
      serviceID,
      templateID,
      templateParams
    });

    try {
      // Gửi email qua EmailJS (không cần truyền publicKey vì đã init)
      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams
      );

      console.log('✅ Email sent successfully!', response);
      
      // Hiển thị thông báo thành công
      alert('✅ Gửi tin nhắn thành công!\n\nCảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      console.error('Error details:', {
        text: error.text,
        status: error.status,
        message: error.message
      });
      
      // Hiển thị thông báo lỗi chi tiết
      alert(`❌ Có lỗi xảy ra khi gửi tin nhắn.\n\nChi tiết lỗi: ${error.text || error.message}\n\nVui lòng kiểm tra:\n1. Service ID: ${serviceID}\n2. Template ID: ${templateID}\n3. Các biến trong template phải khớp với code`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1><i className="fas fa-envelope"></i> Liên hệ với chúng tôi</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="contact-cards-section">
        <div className="container">
          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Địa chỉ</h3>
              <p>600, đường Nguyễn Văn Cừ</p>
              <p>Phường An Bình, Quận Ninh Kiều</p>
              <p>Cần Thơ, Việt Nam</p>
            </div>

            <div className="contact-card">
              <div className="card-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Điện thoại</h3>
              <p><a href="tel:0392020136">039 2020 136</a></p>
              <p className="card-subtitle">Hỗ trợ 24/7</p>
            </div>

            <div className="contact-card">
              <div className="card-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p><a href="mailto:info@sakefruit.com">info@sakefruit.com</a></p>
              <p className="card-subtitle">Phản hồi trong 24h</p>
            </div>

            <div className="contact-card">
              <div className="card-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Giờ làm việc</h3>
              <p>Thứ 2 - Chủ nhật</p>
              <p>8:00 - 20:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="section-header">
                <i className="fas fa-paper-plane"></i>
                <h2>Gửi tin nhắn cho chúng tôi</h2>
                <p>Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại sớm nhất</p>
              </div>
              
              <form className="modern-contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nhập họ và tên của bạn"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-envelope"></i> Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-phone"></i> Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0123 456 789"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-tag"></i> Chủ đề
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Hỏi về sản phẩm</option>
                      <option value="order">Đặt hàng</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="feedback">Góp ý</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-comment"></i> Nội dung *
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-send" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="contact-info-sidebar">
              <div className="info-box">
                <h3><i className="fas fa-question-circle"></i> Câu hỏi thường gặp</h3>
                <div className="faq-item">
                  <h4>Thời gian giao hàng?</h4>
                  <p>Đơn hàng sẽ được giao trong 2-3 ngày làm việc tại khu vực nội thành.</p>
                </div>
                <div className="faq-item">
                  <h4>Chính sách đổi trả?</h4>
                  <p>Hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất.</p>
                </div>
                <div className="faq-item">
                  <h4>Phương thức thanh toán?</h4>
                  <p>Thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng.</p>
                </div>
              </div>

              <div className="info-box">
                <h3><i className="fas fa-share-alt"></i> Kết nối với chúng tôi</h3>
                <div className="social-links-modern">
                  <a href="https://www.facebook.com/share/1HzpsrKSFq/?mibextid=wwXIfr" className="social-btn facebook" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="social-btn instagram" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="social-btn zalo" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-comments"></i>
                    <span>Zalo</span>
                  </a>
                  <a href="#" className="social-btn tiktok" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-tiktok"></i>
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <i className="fas fa-map-marked-alt"></i>
            <h2>Địa chỉ trên bản đồ</h2>
            <p>600, đường Nguyễn Văn Cừ, Phường An Bình, Quận Ninh Kiều, Cần Thơ</p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184285244!2d105.76804931428696!3d10.029933992828937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1679045234567!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
