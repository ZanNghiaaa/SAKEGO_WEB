import mongoose from 'mongoose';
import Product from './src/models/Product.js';

const updateProductImagesLocal = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Kết nối thành công!\n');
    
    // Cập nhật ảnh từ thư mục public/assets/images
    const updates = [
      // TRÀ SA KÊ (chỉ có 1 sản phẩm)
      { name: 'Trà Sa Kê Nguyên Chất', image: '/assets/images/Trà sake.png' },
      
      // SỮA GẠO SA KÊ - dùng ảnh mochi tạm (bạn có thể thêm ảnh sữa gạo sau)
      { name: 'Sữa Gạo Sa Kê Nguyên Chất', image: '/assets/images/mochi.png' },
      { name: 'Sữa Gạo Sa Kê Vị Dâu', image: '/assets/images/mochi.png' },
      { name: 'Sữa Gạo Sa Kê Vị Matcha', image: '/assets/images/mochi.png' },
      { name: 'Sữa Gạo Sa Kê Vị Cacao', image: '/assets/images/mochi.png' },
      { name: 'Sữa Gạo Sa Kê Yến Mạch', image: '/assets/images/mochi.png' },
      
      // BÁNH MOCHI SA KÊ
      { name: 'Bánh Mochi Sa Kê Nhân Dâu', image: '/assets/images/mochi.png' },
      { name: 'Bánh Mochi Sa Kê Nhân Matcha', image: '/assets/images/mochicombo.png' },
      { name: 'Bánh Mochi Sa Kê Nhân Trà Xanh', image: '/assets/images/mochi.png' },
      { name: 'Bánh Mochi Sa Kê Nhân Đậu Đỏ', image: '/assets/images/mochicombo.png' },
      { name: 'Bánh Mochi Sa Kê Nhân Mè Đen', image: '/assets/images/mochi.png' }
    ];
    
    console.log('🖼️  Cập nhật ảnh local cho sản phẩm...\n');
    
    let successCount = 0;
    let notFoundCount = 0;
    
    for (const update of updates) {
      const result = await Product.updateOne(
        { name: update.name },
        { $set: { image: update.image } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ ${update.name}`);
        console.log(`   ${update.image}\n`);
        successCount++;
      } else {
        console.log(`⚠️  Không tìm thấy: ${update.name}\n`);
        notFoundCount++;
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 Tổng kết:`);
    console.log(`   ✅ Cập nhật thành công: ${successCount}`);
    console.log(`   ⚠️  Không tìm thấy: ${notFoundCount}`);
    console.log('='.repeat(80));
    
    // Hiển thị danh sách sản phẩm
    const products = await Product.find({}).select('name image category').sort({ category: 1, name: 1 });
    console.log('\n📦 Danh sách sản phẩm với ảnh:\n');
    
    products.forEach((p, i) => {
      const categoryEmoji = p.category === 'tea' ? '🍵' : p.category === 'rice-milk' ? '🥛' : '🍡';
      console.log(`${categoryEmoji} ${i + 1}. ${p.name}`);
      console.log(`   ${p.image}`);
    });
    
    console.log('\n✅ Hoàn tất! Refresh trang web để xem ảnh mới.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

updateProductImagesLocal();
