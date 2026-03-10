import React, { useState } from 'react';
import Loading from '../components/Loading';

const LoadingDemo = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Loading Animation Demo</h1>
      <p>Demo hiệu ứng loading với linh vật Sa Ô Kê</p>
      
      <button 
        onClick={() => setShowLoading(!showLoading)}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        {showLoading ? 'Ẩn Loading' : 'Hiện Loading'}
      </button>

      {showLoading && <Loading message="Đang tải dữ liệu..." />}
    </div>
  );
};

export default LoadingDemo;
