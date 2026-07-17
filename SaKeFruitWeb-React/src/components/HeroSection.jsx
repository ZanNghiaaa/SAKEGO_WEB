import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import linhvatImage from '../assets/images/linhvat01.png';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const HeroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  const chips = [
    { icon: <LeafIcon />, label: 'Nguyên liệu sạch' },
    { icon: <SparkleIcon />, label: 'Chế biến tinh gọn' },
    { icon: <TruckIcon />, label: 'Đóng gói đẹp mắt' },
  ];

  return (
    <section className="hero-sakego">
      <div className="hero-sakego__video-shell" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-sakego__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={VIDEO_URL}
        />
        <div className="hero-sakego__overlay hero-sakego__overlay--top"></div>
        <div className="hero-sakego__overlay hero-sakego__overlay--middle"></div>
        <div className="hero-sakego__overlay hero-sakego__overlay--bottom"></div>
        <div className="hero-sakego__grain"></div>
        <div className="hero-sakego__ambient hero-sakego__ambient--left"></div>
        <div className="hero-sakego__ambient hero-sakego__ambient--right"></div>
      </div>

      <div className="hero-sakego__inner">
        <div className="hero-sakego__layout">
          <div className="hero-sakego__copy">
            <div className="hero-sakego__badge animate-fade-rise">
              <span className="hero-sakego__badge-dot"></span>
              <span>Sakego • Tươi sạch từ vườn đến bàn ăn</span>
            </div>

            <h1 className="hero-sakego__title animate-fade-rise-delay prevent-overlap">
              <span className="hero-sakego__title-line hero-sakego__title-line--dark">SAKEGO</span>
              <span className="hero-sakego__title-line hero-sakego__title-line--accent">Chọn thực phẩm sạch, chọn tương lai xanh</span>
            </h1>

            <p className="hero-sakego__subtitle animate-fade-rise-delay prevent-overlap">
              Sakego chọn lọc nguyên liệu kỹ lưỡng, chế biến tinh gọn và đóng gói chỉn chu để giữ vị tươi tự nhiên trong từng sản phẩm.
            </p>

            <div className="hero-sakego__actions animate-fade-rise-delay-2">
              <Link to="/products" className="hero-sakego__btn hero-sakego__btn--primary">
                Khám phá sản phẩm
              </Link>
              <Link to="/about" className="hero-sakego__btn hero-sakego__btn--secondary">
                Xem câu chuyện SaKeGo
              </Link>
            </div>

            <div className="hero-sakego__chips animate-fade-rise-delay-2">
              {chips.map((chip) => (
                <div key={chip.label} className="hero-sakego__chip">
                  <span className="hero-sakego__chip-icon">{chip.icon}</span>
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20.5 3.5c-5.7.3-10.2 2-13.3 5.1-3.4 3.4-4.8 8.3-3.7 12.1.1.3.4.6.7.7 3.9 1.1 8.7-.3 12.1-3.7 3.1-3.1 4.8-7.6 5.1-13.3 0-.5-.4-.9-.9-.9Zm-4.2 4.6c.4.4.4 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4-1.4l7.2-7.2c.4-.4 1-.4 1.4 0Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2.4a1 1 0 0 1 .9.6l1.5 3.8 3.8 1.5a1 1 0 0 1 0 1.8l-3.8 1.5-1.5 3.8a1 1 0 0 1-1.8 0l-1.5-3.8-3.8-1.5a1 1 0 0 1 0-1.8l3.8-1.5 1.5-3.8a1 1 0 0 1 .9-.6Zm7.3 10.7a.9.9 0 0 1 .9.6l.8 2.1 2.1.8a.9.9 0 0 1 0 1.7l-2.1.8-.8 2.1a.9.9 0 0 1-1.7 0l-.8-2.1-2.1-.8a.9.9 0 0 1 0-1.7l2.1-.8.8-2.1a.9.9 0 0 1 .8-.6Z" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h9A1.5 1.5 0 0 1 15 6.5V15h1.2a2.8 2.8 0 0 1 5.3 1.3 2.8 2.8 0 0 1-.1.7h.1a1 1 0 0 1 0 2h-1.4a2.8 2.8 0 0 1-5.4 0H9.3a2.8 2.8 0 0 1-5.4 0H3a1 1 0 0 1-1-1V6.5A1.5 1.5 0 0 1 3.5 5H4v11h.1a2.8 2.8 0 0 1 5.3 0H14V7H4v10H3V6.5Zm4.1 10.8a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Zm12 0a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />
  </svg>
);

export default HeroSection;
