import React from 'react';
import '../assets/css/marquee.css';

const MarqueeTicker = () => {
  return (
    <div className="home-marquee-wrapper">
      <div className="home-marquee-content">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="marquee-item">
            SAKE VIỆT <span className="mq-star">✳</span> XANH HÓA VÙNG TRỒNG <span className="mq-star">✳</span> GIẢI PHÁP BỀN VỮNG <span className="mq-star">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
