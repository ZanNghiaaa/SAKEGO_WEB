import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser, isAdmin } from '../controllers/UserController';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { isLoading, withLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (getCurrentUser()) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    await withLoading(async () => {
      try {
        const user = await loginUser(formData.emailOrUsername, formData.password);
        alert(`Chào mừng ${user.fullname || user.username}! Đăng nhập thành công.`);
        
        // Force page reload to update all components
        if (user.role === 'admin') {
          window.location.href = '/admin'; // Admin → Admin Dashboard
        } else {
          window.location.href = '/'; // Customer → Home page
        }
      } catch (err) {
        setError(err.message);
      }
    }, 500); // Minimum delay
  };

  return (
    <>
      {isLoading && <Loading message="Đang đăng nhập..." />}
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
                  <h2>Chào mừng trở lại!</h2>
                  <p>Đăng nhập để tiếp tục mua sắm</p>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-header">
                <h1>Đăng nhập</h1>
                <p className="subtitle">Nhập thông tin để tiếp tục</p>
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
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="emailOrUsername">Email hoặc Username</label>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="password">Mật khẩu</label>
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="forgot-password-link" style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                  <Link to="/forgot-password" style={{ color: '#7CB342', fontSize: '14px', textDecoration: 'none' }}>
                    <i className="fas fa-key"></i> Quên mật khẩu?
                  </Link>
                </div>

                <button type="submit" className="btn-modern">
                  <span>Đăng nhập</span>
                  <i className="fas fa-arrow-right"></i>
                </button>

                <div className="form-footer">
                  <p>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="link-primary">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default Login;
