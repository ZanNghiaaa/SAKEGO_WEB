import React from 'react';
import './ARViewer.css';

const ARViewer = ({ isOpen, onClose, modelUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="ar-modal-overlay">
      <div className="ar-modal-content">
        <div className="ar-modal-header">
          <h3>{title || "Xem 3D & AR Thực Tế"}</h3>
          <button className="ar-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="ar-model-container">
          {/* Google Model Viewer Component */}
          <model-viewer
            src={modelUrl || "https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.glb"}
            ios-src=""
            alt="3D Product Model"
            shadow-intensity="1"
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            environment-image="neutral"
            style={{ width: '100%', height: '100%', backgroundColor: '#f9fbe7' }}
          >
            <button slot="ar-button" className="ar-button">
              <i className="fas fa-cube"></i> Bấm để xem trong không gian thực (AR)
            </button>
          </model-viewer>
        </div>
        <div className="ar-modal-footer">
          <p>
            <i className="fas fa-info-circle"></i> 
            Dùng chuột/tay kéo để xoay 360°. Truy cập bằng điện thoại và bấm nút AR để đặt thử lên bàn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
