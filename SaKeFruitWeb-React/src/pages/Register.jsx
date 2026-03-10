import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getCurrentUser } from '../controllers/UserController';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    await withLoading(async () => {
      try {
        await registerUser(formData);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } catch (err) {
        setError(err.message);
      }
    }, 500);
  };

  return (
    <>
      {isLoading && <Loading message="Đang tạo tài khoản..." />}
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
                  <h2>Tham gia cùng chúng tôi!</h2>
                  <p>Tạo tài khoản để bắt đầu</p>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-header">
                <h1>Đăng ký</h1>
                <p className="subtitle">Điền thông tin để tạo tài khoản mới</p>
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
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="fullname">Họ và tên</label>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="phone">Số điện thoại</label>
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

                <div className="input-group">
                  <div className="input-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-modern">
                  <span>Đăng ký</span>
                  <i className="fas fa-arrow-right"></i>
                </button>

                <div className="form-footer">
                  <p>
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="link-primary">
                      Đăng nhập
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

export default Register;
