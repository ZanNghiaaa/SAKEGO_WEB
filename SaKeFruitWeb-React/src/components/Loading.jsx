import React from 'react';
import linhvatImage from '../assets/images/linhvat01.png';
import '../assets/css/loading.css';

const Loading = ({ fullScreen = true, message = "Đang tải..." }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-content">
        {/* Modern spinner ring */}
        <div className="modern-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>

        {/* Animated mascot */}
        <div className="mascot-wrapper">
          <img src={linhvatImage} alt="Loading" className="mascot-image" />
        </div>

        {/* Loading text */}
        <p className="loading-text">{message}</p>

        {/* Minimal dots */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
