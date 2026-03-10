import mongoose from 'mongoose';
import Product from './src/models/Product.js';

const updateProductImages = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Kết nối thành công!\n');
    
    // Cập nhật ảnh cho từng sản phẩm
    const updates = [
      // TRÀ SA KÊ
      { name: 'Trà Sa Kê Ô Long Cao Cấp', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-oolong.jpg' },
      { name: 'Trà Sa Kê Sen Việt', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-sen.jpg' },
      { name: 'Trà Sa Kê Lài Hoa', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-lai.jpg' },
      { name: 'Trà Sa Kê Trà Xanh Matcha', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-matcha.jpg' },
      
      // SỮA GẠO SA KÊ
      { name: 'Sữa Gạo Sa Kê Nguyên Chất', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-nguyen-chat.jpg' },
      { name: 'Sữa Gạo Sa Kê Vị Dâu', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-dau.jpg' },
      { name: 'Sữa Gạo Sa Kê Vị Matcha', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-matcha.jpg' },
      { name: 'Sữa Gạo Sa Kê Vị Cacao', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-cacao.jpg' },
      { name: 'Sữa Gạo Sa Kê Yến Mạch', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-yen-mach.jpg' },
      
      // BÁNH MOCHI SA KÊ
      { name: 'Bánh Mochi Sa Kê Nhân Dâu', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-dau.jpg' },
      { name: 'Bánh Mochi Sa Kê Nhân Matcha', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-matcha.jpg' },
      { name: 'Bánh Mochi Sa Kê Nhân Trà Xanh', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-tra-xanh.jpg' },
      { name: 'Bánh Mochi Sa Kê Nhân Đậu Đỏ', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-dau-do.jpg' },
      { name: 'Bánh Mochi Sa Kê Nhân Mè Đen', image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-me-den.jpg' }
    ];
    
    console.log('🖼️  Cập nhật ảnh cho sản phẩm...\n');
    
    for (const update of updates) {
      const result = await Product.updateOne(
        { name: update.name },
        { $set: { image: update.image } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ ${update.name}`);
        console.log(`   ${update.image}\n`);
      } else {
        console.log(`⚠️  Không tìm thấy: ${update.name}\n`);
      }
    }
    
    console.log('\n📊 HOÀN THÀNH!');
    console.log('Tất cả sản phẩm đã được cập nhật ảnh từ Cloudinary.');
    
    // Hiển thị danh sách sản phẩm sau khi cập nhật
    const products = await Product.find({}).select('name image category');
    console.log('\n📦 Danh sách sản phẩm với ảnh mới:\n');
    
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
    
    console.log('🍵 TRÀ SA KÊ:');
    byCategory['tea'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      ${p.image}`);
    });
    
    console.log('\n🥛 SỮA GẠO SA KÊ:');
    byCategory['rice-milk'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      ${p.image}`);
    });
    
    console.log('\n🍡 BÁNH MOCHI SA KÊ:');
    byCategory['mochi'].forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      ${p.image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

updateProductImages();
