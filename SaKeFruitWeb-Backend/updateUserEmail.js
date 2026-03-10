import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateEmail = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Update email từ vannghia170320@gmail.com sang VanNghia.170320@gmail.com
    const result = await usersCollection.updateOne(
      { email: 'vannghia170320@gmail.com' },
      { 
        $set: { 
          email: 'vannghia.170320@gmail.com',
          username: 'vannghia.170320'
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Đã cập nhật email thành công!');
      
      // Hiển thị user sau khi update
      const user = await usersCollection.findOne({ email: 'vannghia.170320@gmail.com' });
      console.log('\n📧 Email mới:', user.email);
      console.log('👤 Username mới:', user.username);
    } else {
      console.log('❌ Không tìm thấy user để cập nhật');
    }

    await mongoose.connection.close();
    console.log('\n✅ Hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

updateEmail();
