import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendEmail, resetPasswordEmail, tempPasswordEmail } from '../utils/email.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, fullname, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username: email.split('@')[0] }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc tên đăng nhập đã tồn tại!'
      });
    }
    
    // Create user
    const user = await User.create({
      username: email.split('@')[0], // Generate username from email
      email,
      password,
      fullname,
      phone,
      address: address || ''
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Normalize to lowercase for comparison
    const normalizedInput = emailOrUsername.toLowerCase().trim();
    
    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: normalizedInput },
        { username: normalizedInput }
      ]
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại!'
      });
    }
    
    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng!'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa!'
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
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
    // In JWT, logout is handled on frontend by removing token
    // But we can add additional logic here if needed
    
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
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email!'
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với email này!'
      });
    }
    
    // Generate temporary password (8 characters: letters + numbers)
    const tempPassword = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Update user password with temporary password
    user.password = tempPassword;
    await user.save();
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Mật khẩu tạm thời - SaKeFruit',
        html: tempPasswordEmail(user.fullname, tempPassword)
      });
      
      res.json({
        success: true,
        message: 'Mật khẩu tạm thời đã được gửi về email của bạn!'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email. Vui lòng thử lại sau!'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự!'
      });
    }
    
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!'
      });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    // Generate new token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google Auth Login/Register
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Thiếu credential' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if user exists by googleId
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      // Check if user exists by email (link accounts if so)
      user = await User.findOne({ email });

      if (user) {
        // Link googleId to existing user
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      } else {
        // Create new user
        // Chú ý: sđt bắt buộc ở schema gốc, nên tạo một default
        user = await User.create({
          googleId: sub,
          username: email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 6),
          email,
          fullname: name,
          avatar: picture,
          phone: '0000000000', // Sẽ được yêu cầu cập nhật sau
          address: '',
          isActive: true
        });
      }
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập Google thành công!',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ success: false, message: 'Xác thực Google thất bại' });
  }
};
