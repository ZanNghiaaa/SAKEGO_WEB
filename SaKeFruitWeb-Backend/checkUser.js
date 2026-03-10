import mongoose from 'mongoose';
import User from './src/models/User.js';

const checkUser = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Đã kết nối MongoDB\n');

    const email = 'VanNghia.170320@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      console.log('✅ Tìm thấy user:');
      console.log('ID:', user._id);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Fullname:', user.fullname);
      console.log('Role:', user.role);
    } else {
      console.log('❌ Không tìm thấy user với email:', email);
      console.log('\n📝 Danh sách tất cả users:');
      const allUsers = await User.find({});
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.username})`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.disconnect();
  }
};

checkUser();
