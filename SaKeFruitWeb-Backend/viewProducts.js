import mongoose from 'mongoose';
import Product from './src/models/Product.js';

const viewProducts = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sakego');
    console.log('✅ Kết nối thành công!\n');
    
    const products = await Product.find({}).sort({ category: 1, name: 1 });
    
    console.log('📊 DANH SÁCH SẢN PHẨM TRONG DATABASE SAKEGO:');
    console.log('='.repeat(80));
    
    const groupedProducts = {
      'tea': [],
      'rice-milk': [],
      'mochi': []
    };
    
    products.forEach(p => {
      groupedProducts[p.category].push(p);
    });
    
    // Hiển thị theo từng category
    console.log('\n🍵 TRÀ SA KÊ:');
    console.log('-'.repeat(80));
    groupedProducts['tea'].forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Giá: ${p.price.toLocaleString('vi-VN')}đ | Stock: ${p.stock} | Category: ${p.category}`);
      console.log(`   Mô tả: ${p.description.substring(0, 80)}...`);
      console.log('');
    });
    
    console.log('\n🥛 SỮA GẠO SA KÊ:');
    console.log('-'.repeat(80));
    groupedProducts['rice-milk'].forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Giá: ${p.price.toLocaleString('vi-VN')}đ | Stock: ${p.stock} | Category: ${p.category}`);
      console.log(`   Mô tả: ${p.description.substring(0, 80)}...`);
      console.log('');
    });
    
    console.log('\n🍡 BÁNH MOCHI SA KÊ:');
    console.log('-'.repeat(80));
    groupedProducts['mochi'].forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Giá: ${p.price.toLocaleString('vi-VN')}đ | Stock: ${p.stack} | Category: ${p.category}`);
      console.log(`   Mô tả: ${p.description.substring(0, 80)}...`);
      console.log('');
    });
    
    console.log('\n📊 TỔNG KẾT:');
    console.log('='.repeat(80));
    console.log(`Tổng số sản phẩm: ${products.length}`);
    console.log(`- Trà Sa Kê: ${groupedProducts['tea'].length} sản phẩm`);
    console.log(`- Sữa Gạo Sa Kê: ${groupedProducts['rice-milk'].length} sản phẩm`);
    console.log(`- Bánh Mochi Sa Kê: ${groupedProducts['mochi'].length} sản phẩm`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

viewProducts();
