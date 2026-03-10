import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@sakefruit.com',
    password: 'admin123',
    fullname: 'Quản trị viên',
    phone: '0987654321',
    address: 'TP. Cần Thơ',
    role: 'admin'
  },
  {
    username: 'user01',
    email: 'user01@gmail.com',
    password: 'user123',
    fullname: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường 3/2, Ninh Kiều, Cần Thơ',
    role: 'customer'
  },
  {
    username: 'user02',
    email: 'user02@gmail.com',
    password: 'user123',
    fullname: 'Trần Thị B',
    phone: '0987654320',
    address: '456 Mậu Thân, Cái Răng, Cần Thơ',
    role: 'customer'
  }
];

const products = [
  {
    name: 'Snack SAKEGO Phô Mai',
    price: 19000,
    image: '/assets/images/Nền xám.png',
    description: 'Snack SAKEGO giòn tan, vị phô mai béo ngậy. Sản phẩm ăn liền tiện lợi, thích hợp mọi lúc. Trọng lượng: 60g',
    category: 'snack',
    stock: 110,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Trà SAKEGO Nguyên Chất',
    price: 17000,
    image: '/assets/images/Trà sake.png',
    description: 'Trà SAKEGO 100% tự nhiên, giàu chất chống oxi hóa. Pha liền tiện lợi, thơm ngon. Trọng lượng: 50g',
    category: 'tea',
    stock: 80,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Khô SAKEGO Sấy Khô',
    price: 29000,
    image: '/assets/images/khosake.png',
    description: 'SAKEGO sấy khô giữ nguyên dinh dưỡng. Sản phẩm ăn liền tiện lợi, dễ bảo quản. Trọng lượng: 80g',
    category: 'dried',
    stock: 60,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi Combo 4 Vị',
    price: 39000,
    image: '/assets/images/mochicombo.png',
    description: 'Combo 4 vị mochi SAKEGO đa dạng: Phô mai, Rong biển, Truyền thống, Sôcôla. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
    stock: 100,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi SAKEGO',
    price: 12000,
    image: '/assets/images/mochi.png',
    description: 'Bánh mochi SAKEGO mềm mịn, thơm ngon. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
    stock: 200,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mật SAKEGO',
    price: 20000,
    image: '/assets/images/banhmat.png',
    description: 'Bánh mật SAKEGO thơm ngon, ngọt thanh tự nhiên. Sản phẩm ăn liền tiện lợi cho mọi lứa tuổi. Trọng lượng: 80g',
    category: 'honey-cake',
    stock: 90,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Combo Sa Kê Đa Dạng',
    price: 180000,
    image: 'https://placehold.co/400x300/5C6BC0/white?text=Combo+Da+Dang',
    description: 'Combo gồm: Mochi, Snack, Trà Sa Kê - Trọn vẹn hương vị. Tất cả đều là sản phẩm ăn liền tiện lợi.',
    category: 'combo',
    stock: 50,
    isTrial: false,
    isReadyToEat: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    
    console.log('✅ Đã xóa dữ liệu cũ');
    
    console.log('📥 Đang thêm dữ liệu mẫu...');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Đã thêm ${createdUsers.length} người dùng`);
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Đã thêm ${createdProducts.length} sản phẩm`);
    
    console.log('\n🎉 Seed database thành công!');
    console.log('\n📋 Thông tin đăng nhập:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@sakefruit.com');
    console.log('   Password: admin123');
    console.log('\n👤 Customer 1:');
    console.log('   Email: user01@gmail.com');
    console.log('   Password: user123');
    console.log('\n👤 Customer 2:');
    console.log('   Email: user02@gmail.com');
    console.log('   Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
