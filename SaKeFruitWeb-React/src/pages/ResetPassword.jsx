import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Đặt lại mật khẩu thành công!');
        navigate('/');
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Reset password error:', error);
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
                  <h2>Mật khẩu mới</h2>
                  <p>Tạo mật khẩu mạnh và an toàn</p>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-header">
                <h1>Đặt lại mật khẩu</h1>
                <p className="subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>
              </div>

              <form onSubmit={handleSubmit} className="modern-form">
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-key"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      disabled={loading}
                      minLength={6}
                    />
                    <label htmlFor="password">Mật khẩu mới</label>
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      disabled={loading}
                      minLength={6}
                    />
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  </div>
                </div>

                <div className="password-requirements">
                  <p><i className="fas fa-info-circle"></i> Yêu cầu mật khẩu:</p>
                  <ul>
                    <li className={formData.password.length >= 6 ? 'valid' : ''}>
                      <i className={formData.password.length >= 6 ? 'fas fa-check' : 'fas fa-circle'}></i>
                      Ít nhất 6 ký tự
                    </li>
                    <li className={formData.password === formData.confirmPassword && formData.password ? 'valid' : ''}>
                      <i className={formData.password === formData.confirmPassword && formData.password ? 'fas fa-check' : 'fas fa-circle'}></i>
                      Mật khẩu khớp nhau
                    </li>
                  </ul>
                </div>

                <button type="submit" className="btn-modern" disabled={loading}>
                  {loading ? (
                    <>
                      <span>Đang xử lý...</span>
                      <i className="fas fa-spinner fa-spin"></i>
                    </>
                  ) : (
                    <>
                      <span>Đặt lại mật khẩu</span>
                      <i className="fas fa-check"></i>
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
