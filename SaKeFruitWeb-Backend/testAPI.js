import mongoose from 'mongoose';
import Product from './src/models/Product.js';

const testAPI = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Kết nối thành công!\n');
    
    // Test query products
    const products = await Product.find({}).sort({ category: 1, name: 1 });
    
    console.log('📊 TEST API - Lấy sản phẩm từ database:');
    console.log('='.repeat(80));
    console.log(`Tổng số sản phẩm: ${products.length}\n`);
    
    // Group by category
    const byCategory = {
      'tea': [],
      'rice-milk': [],
      'mochi': []
    };
    
    products.forEach(p => {
      if (byCategory[p.category]) {
        byCategory[p.category].push(p);
      }
    });
    
    console.log('🍵 TRÀ SA KÊ:', byCategory['tea'].length, 'sản phẩm');
    byCategory['tea'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - ${p.price.toLocaleString('vi-VN')}đ`);
    });
    
    console.log('\n🥛 SỮA GẠO SA KÊ:', byCategory['rice-milk'].length, 'sản phẩm');
    byCategory['rice-milk'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - ${p.price.toLocaleString('vi-VN')}đ`);
    });
    
    console.log('\n🍡 BÁNH MOCHI SA KÊ:', byCategory['mochi'].length, 'sản phẩm');
    byCategory['mochi'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} - ${p.price.toLocaleString('vi-VN')}đ`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ API sẵn sàng tại: http://localhost:5000/api/products');
    console.log('✅ Frontend đang chạy tại: http://localhost:3001');
    console.log('\n💡 Mở trình duyệt và truy cập: http://localhost:3001/products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

testAPI();
