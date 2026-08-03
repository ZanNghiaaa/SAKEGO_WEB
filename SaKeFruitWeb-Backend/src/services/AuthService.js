import userRepository from '../repositories/UserRepository.js';
import { generateToken } from '../middleware/auth.js';
import { sendEmail, resetPasswordEmail, tempPasswordEmail } from '../utils/email.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async register(email, password, fullname, phone, address) {
    const existingUser = await userRepository.findOne({
      $or: [{ email }, { username: email.split('@')[0] }]
    });
    
    if (existingUser) {
      throw new Error('Email hoặc tên đăng nhập đã tồn tại!');
    }
    
    const user = await userRepository.create({
      username: email.split('@')[0],
      email,
      password,
      fullname,
      phone,
      address: address || ''
    });
    
    const token = generateToken(user._id);
    return { user, token };
  }

  async login(emailOrUsername, password) {
    const normalizedInput = emailOrUsername.toLowerCase().trim();
    
    const user = await userRepository.findOneWithPassword({
      $or: [
        { email: normalizedInput },
        { username: normalizedInput }
      ]
    });
    
    if (!user) {
      throw new Error('Tài khoản không tồn tại!');
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      throw new Error('Mật khẩu không đúng!');
    }
    
    if (!user.isActive) {
      throw new Error('Tài khoản đã bị vô hiệu hóa!');
    }
    
    user.lastLogin = Date.now();
    await userRepository.save(user);
    
    const token = generateToken(user._id);
    return { user, token };
  }

  async forgotPassword(email) {
    if (!email) {
      throw new Error('Vui lòng nhập email!');
    }
    
    const user = await userRepository.findOneWithPassword({ email: email.toLowerCase().trim() });
    
    if (!user) {
      throw new Error('Không tìm thấy tài khoản với email này!');
    }
    
    const tempPassword = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    user.password = tempPassword;
    await userRepository.save(user);
    
    await sendEmail({
      email: user.email,
      subject: 'Mật khẩu tạm thời - SaKeGo',
      html: tempPasswordEmail(user.fullname, tempPassword)
    });
    
    return true;
  }

  async resetPassword(token, password) {
    if (!password || password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    }
    
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const user = await userRepository.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new Error('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!');
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await userRepository.save(user);
    
    const newToken = generateToken(user._id);
    return { user, token: newToken };
  }

  async googleAuth(credential) {
    if (!credential) {
      throw new Error('Thiếu credential');
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await userRepository.findOne({ googleId: sub });

    if (!user) {
      user = await userRepository.findOne({ email });

      if (user) {
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        await userRepository.save(user);
      } else {
        user = await userRepository.create({
          googleId: sub,
          username: email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 6),
          email,
          fullname: name,
          avatar: picture,
          phone: '0000000000',
          address: '',
          isActive: true
        });
      }
    }

    user.lastLogin = Date.now();
    await userRepository.save(user);

    const token = generateToken(user._id);
    return { user, token };
  }
}

export default new AuthService();
