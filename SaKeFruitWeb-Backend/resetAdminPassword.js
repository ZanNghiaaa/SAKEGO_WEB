import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Đã kết nối MongoDB');

    // Tìm admin user
    const admin = await User.findOne({ email: 'admin@sakefruit.com' });
    
    if (admin) {
      // Reset password
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Đã reset password cho admin thành công!');
      console.log('📧 Email: admin@sakefruit.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ Không tìm thấy admin user');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.disconnect();
  }
};

resetAdminPassword();
