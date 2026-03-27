import mongoose from 'mongoose';

const checkDatabase = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Kết nối thành công đến database:', conn.connection.name);
    


    
    // Lấy danh sách collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📋 Các collection trong database sakego:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Đếm số lượng documents
    console.log('\n📊 Số lượng dữ liệu:');
    for (const col of collections) {
      const count = await conn.connection.db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

checkDatabase();
