import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { emailjs.init('ogExQkHNH2O6_vHj3'); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const templateParams = {
      from_name:  formData.name,
      from_email: formData.email,
      from_phone: formData.phone || 'Không cung cấp',
      subject:    formData.subject || 'Liên hệ chung',
      message:    formData.message
    };
    try {
      await emailjs.send('service_l0u0fer', 'template_t2gxwg9', templateParams);
      setSubmitted(true);
      setFormData({ name:'', email:'', phone:'', subject:'', message:'' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert(`❌ Có lỗi xảy ra: ${error.text || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>

      {/* ── HERO ── */}
      <section className="contact-hero-new">
        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-particles" aria-hidden="true">
          <span className="ch-orb ch-orb-1"></span>
          <span className="ch-orb ch-orb-2"></span>
          <span className="ch-orb ch-orb-3"></span>
          <span className="ch-leaf ch-leaf-1"><i className="fas fa-leaf"></i></span>
          <span className="ch-leaf ch-leaf-2"><i className="fas fa-leaf"></i></span>
          <span className="ch-ring ch-ring-1"></span>
          <span className="ch-ring ch-ring-2"></span>
        </div>

        <div className="container">
          <div className="contact-hero-content">
            <span className="contact-hero-eyebrow">
              <span className="eyebrow-dot"></span>
              Kết nối với SAKEGO
            </span>
            <h1 className="contact-hero-title">
              Liên Hệ <span className="ch-accent">Chúng Tôi</span>
            </h1>
            <p className="contact-hero-desc">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong thời gian sớm nhất
            </p>
            <div className="contact-hero-pills">
              <span className="ch-pill"><i className="fas fa-clock"></i> Phản hồi trong 24h</span>
              <span className="ch-pill"><i className="fas fa-headset"></i> Hỗ trợ 24/7</span>
              <span className="ch-pill"><i className="fas fa-shield-alt"></i> Tư vấn miễn phí</span>
            </div>
          </div>
        </div>

        <div className="contact-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="contact-cards-section">
        <div className="container">
          <div className="contact-cards-grid">
            {[
              { icon:'fas fa-map-marker-alt', color:'green',  title:'Địa chỉ',      lines:['600, đường Nguyễn Văn Cừ','Phường An Bình, Quận Ninh Kiều','Cần Thơ, Việt Nam'] },
              { icon:'fas fa-phone-alt',      color:'blue',   title:'Điện thoại',   lines:['039 2020 136'], sub:'Hỗ trợ 24/7', href:'tel:0392020136' },
              { icon:'fas fa-envelope',       color:'orange', title:'Email',        lines:['info@sakefruit.com'], sub:'Phản hồi trong 24h', href:'mailto:info@sakefruit.com' },
              { icon:'fas fa-clock',          color:'purple', title:'Giờ làm việc', lines:['Thứ 2 – Chủ nhật','8:00 – 20:00'] },
            ].map((card, i) => (
              <div key={i} className={`contact-info-card contact-info-card--${card.color}`} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="cic-icon-wrap">
                  <i className={card.icon}></i>
                </div>
                <div className="cic-body">
                  <h3>{card.title}</h3>
                  {card.lines.map((line, j) =>
                    card.href && j === 0
                      ? <p key={j}><a href={card.href}>{line}</a></p>
                      : <p key={j}>{line}</p>
                  )}
                  {card.sub && <span className="cic-sub">{card.sub}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout">

            {/* Form */}
            <div className="contact-form-panel">
              <div className="cfp-header">
                <div className="cfp-icon"><i className="fas fa-paper-plane"></i></div>
                <div>
                  <h2>Gửi tin nhắn cho chúng tôi</h2>
                  <p>Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất</p>
                </div>
              </div>

              {submitted && (
                <div className="form-success-banner">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Gửi thành công!</strong>
                    <span>Cảm ơn bạn, chúng tôi sẽ phản hồi trong vòng 24 giờ.</span>
                  </div>
                </div>
              )}

              <form className="contact-form-new" onSubmit={handleSubmit}>
                <div className="cfn-row">
                  <div className="cfn-group">
                    <label><i className="fas fa-user"></i> Họ và tên <span>*</span></label>
                    <input type="text" name="name" placeholder="Nhập họ và tên" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="cfn-group">
                    <label><i className="fas fa-envelope"></i> Email <span>*</span></label>
                    <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="cfn-row">
                  <div className="cfn-group">
                    <label><i className="fas fa-phone"></i> Số điện thoại</label>
                    <input type="tel" name="phone" placeholder="0123 456 789" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="cfn-group">
                    <label><i className="fas fa-tag"></i> Chủ đề</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Hỏi về sản phẩm</option>
                      <option value="order">Đặt hàng</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="feedback">Góp ý</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
                <div className="cfn-group">
                  <label><i className="fas fa-comment-dots"></i> Nội dung <span>*</span></label>
                  <textarea name="message" rows="5" placeholder="Nhập nội dung tin nhắn..." value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="cfn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Đang gửi...</>
                  ) : (
                    <><i className="fas fa-paper-plane"></i> Gửi tin nhắn<span className="btn-shine"></span></>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="contact-sidebar">
              <div className="cs-box">
                <div className="cs-box-header">
                  <i className="fas fa-question-circle"></i>
                  <h3>Câu hỏi thường gặp</h3>
                </div>
                {[
                  { q:'Thời gian giao hàng?',    a:'Đơn hàng giao trong 4 giờ làm việc tại nội thành.' },
                  { q:'Chính sách đổi trả?',     a:'Hỗ trợ đổi trả trong 1 ngày nếu sản phẩm lỗi từ nhà sản xuất.' },
                  { q:'Phương thức thanh toán?', a:'Thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng.' },
                ].map((faq, i) => (
                  <div key={i} className="cs-faq-item">
                    <div className="cs-faq-q"><i className="fas fa-chevron-right"></i>{faq.q}</div>
                    <div className="cs-faq-a">{faq.a}</div>
                  </div>
                ))}
              </div>

              <div className="cs-box">
                <div className="cs-box-header">
                  <i className="fas fa-share-alt"></i>
                  <h3>Kết nối với chúng tôi</h3>
                </div>
                <div className="cs-socials">
                  <a href="https://www.facebook.com/share/1HzpsrKSFq/?mibextid=wwXIfr" className="cs-social cs-social--fb" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i><span>Facebook</span>
                  </a>
                  <a href="#" className="cs-social cs-social--zalo" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-comments"></i><span>Zalo</span>
                  </a>
                  <a href="#" className="cs-social cs-social--tiktok" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-tiktok"></i><span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-header">
            <span className="section-label"><i className="fas fa-map-marked-alt"></i> Vị trí</span>
            <h2>Địa chỉ trên bản đồ</h2>
            <p>600, đường Nguyễn Văn Cừ, Phường An Bình, Quận Ninh Kiều, Cần Thơ</p>
          </div>
          <div className="contact-map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184285244!2d105.76804931428696!3d10.029933992828937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMaw!5e0!3m2!1svi!2s!4v1679045234567!5m2!1svi!2s"
              width="100%" height="420" style={{ border: 0 }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Contact;
