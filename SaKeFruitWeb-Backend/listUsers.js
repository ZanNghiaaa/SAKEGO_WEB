import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Đã kết nối MongoDB\n');

    const users = await User.find({});
    
    console.log('📝 Danh sách users trong MongoDB:');
    console.log('================================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullname}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.disconnect();
  }
};

listUsers();
