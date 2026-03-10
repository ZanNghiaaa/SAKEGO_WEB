import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Không thể kết nối đến server. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="modern-auth-section">
        <div className="auth-background">
          <div className="floating-shapes">
            <span className="shape shape-1"></span>
            <span className="shape shape-2"></span>
            <span className="shape shape-3"></span>
            <span className="shape shape-4"></span>
            <span className="shape shape-5"></span>
          </div>
        </div>
        
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="mascot-section">
              <div className="mascot-container">
                <img src="/assets/images/linhvat01.png" alt="SaKeFruit Mascot" className="mascot-image" />
                <div className="welcome-text">
                  <h2>Quên mật khẩu?</h2>
                  <p>Đừng lo! Chúng tôi sẽ giúp bạn</p>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-header">
                <h1>Đặt lại mật khẩu</h1>
                <p className="subtitle">Nhập email để nhận link đặt lại mật khẩu</p>
              </div>

              {success ? (
                <div className="auth-success">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2>Email đã được gửi!</h2>
                  <p>Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                    Link đặt lại mật khẩu sẽ hết hạn sau 10 phút.
                  </p>
                  <Link to="/login" className="btn-modern" style={{ marginTop: '20px', textDecoration: 'none' }}>
                    <span>Quay lại đăng nhập</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="modern-form">
                  {error && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </div>
                  )}

                  <div className="input-group">
                    <div className="input-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder=" "
                        disabled={loading}
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>

                  <button type="submit" className="btn-modern" disabled={loading}>
                    {loading ? (
                      <>
                        <span>Đang gửi...</span>
                        <i className="fas fa-spinner fa-spin"></i>
                      </>
                    ) : (
                      <>
                        <span>Gửi link đặt lại mật khẩu</span>
                        <i className="fas fa-paper-plane"></i>
                      </>
                    )}
                  </button>

                  <div className="form-footer">
                    <p>
                      <Link to="/login" className="link-primary">
                        <i className="fas fa-arrow-left"></i> Quay lại đăng nhập
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
