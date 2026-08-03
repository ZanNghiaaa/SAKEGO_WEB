import authService from '../services/AuthService.js';
import userService from '../services/UserService.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, fullname, phone, address } = req.body;
    
    const { user, token } = await authService.register(email, password, fullname, phone, address);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    if (error.message === 'Email hoặc tên đăng nhập đã tồn tại!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    const { user, token } = await authService.login(emailOrUsername, password);
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    if (error.message === 'Tài khoản không tồn tại!' || error.message === 'Mật khẩu không đúng!' || error.message === 'Tài khoản đã bị vô hiệu hóa!') {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    
    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Đăng xuất thành công!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    
    res.json({
      success: true,
      message: 'Mật khẩu tạm thời đã được gửi về email của bạn!'
    });
  } catch (error) {
    if (error.message === 'Vui lòng nhập email!' || error.message === 'Không tìm thấy tài khoản với email này!') {
      const status = error.message === 'Vui lòng nhập email!' ? 400 : 404;
      return res.status(status).json({ success: false, message: error.message });
    }
    if (error.message === 'Không thể gửi email. Vui lòng thử lại sau!') {
      return res.status(500).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { user, token } = await authService.resetPassword(req.params.token, req.body.password);
    
    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    if (error.message === 'Mật khẩu phải có ít nhất 6 ký tự!' || error.message === 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Google Auth Login/Register
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { user, token } = await authService.googleAuth(req.body.credential);

    res.json({
      success: true,
      message: 'Đăng nhập Google thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ success: false, message: error.message === 'Thiếu credential' ? error.message : 'Xác thực Google thất bại' });
  }
};
