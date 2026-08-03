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
    name: 'Sữa Gạo Sa Kê Premium',
    price: 25000,
    image: '/assets/images/suagaosake.jpg',
    description: 'Sữa gạo Sa Kê 100% tự nhiên, giàu dinh dưỡng, mềm mịn, béo ngậy. Trọng lượng: 200ml',
    category: 'rice-milk',
    stock: 100,
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
    name: 'Combo Sa Kê Đa Dạng',
    price: 90000,
    originalPrice: 100000,
    discount: 10,
    image: '/assets/images/combo_PT.jpg',
    description: 'Trải nghiệm trọn vẹn hương vị Sa Kê. Gồm 1 Trà lá Sa Kê, 1 Sữa gạo Sa Kê và 2 Mochi. Tiết kiệm 10.000đ!',
    category: 'combo',
    stock: 50,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    comboItems: [
      { itemName: 'Trà lá Sa Kê', quantity: 1 },
      { itemName: 'Sữa gạo Sa Kê', quantity: 1 },
      { itemName: 'Bánh Mochi', quantity: 2 }
    ]
  },
  {
    name: 'CHILL MỘT MÌNH',
    price: 36000,
    originalPrice: 40000,
    discount: 10,
    image: '/assets/images/combo_1chilll.png',
    description: 'Thưởng thức trọn vẹn khoảnh khắc riêng tư. Gồm 1 Sữa gạo Sa Kê đậm đà và 1 Mochi núng nính. Tiết kiệm 4.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
    stock: 100,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    comboItems: [
      { itemName: 'Sữa gạo Sa Kê', quantity: 1 },
      { itemName: 'Bánh Mochi', quantity: 1 }
    ]
  },
  {
    name: 'ÍCH KỶ',
    price: 28000,
    originalPrice: 30000,
    discount: 6.7,
    image: '/assets/images/combo_ichki.jpg',
    description: 'Combo nhẹ nhàng cho những ai yêu thích sự tinh tế. Gồm 1 Trà lá Sa Kê thanh mát và 1 Mochi mềm dai. Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
    stock: 120,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    comboItems: [
      { itemName: 'Trà lá Sa Kê', quantity: 1 },
      { itemName: 'Bánh Mochi', quantity: 1 }
    ]
  },
  {
    name: 'DOUBLE CHILL',
    price: 63000,
    originalPrice: 70000,
    discount: 10,
    image: '/assets/images/Combo_2chill.png',
    description: '🔥 BEST SELLER! Combo gấp đôi niềm vui cho cặp đôi hoặc bạn bè. Gồm 2 Sữa gạo Sa Kê thơm ngon và 2 Mochi mềm mịn. Tiết kiệm 7.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
    stock: 150,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    isBestSeller: true,
    comboItems: [
      { itemName: 'Sữa gạo Sa Kê', quantity: 2 },
      { itemName: 'Bánh Mochi', quantity: 2 }
    ]
  },
  {
    name: 'COUPLE CHILL',
    price: 54000,
    originalPrice: 60000,
    discount: 10,
    image: '/assets/images/combo_2chill.jpg',
    description: 'Combo lý tưởng cho các cặp đôi yêu thích trà. Gồm 2 Trà lá Sa Kê thanh mát và 2 Mochi thơm ngon. Tiết kiệm 6.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
    stock: 130,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    comboItems: [
      { itemName: 'Trà lá Sa Kê', quantity: 2 },
      { itemName: 'Bánh Mochi', quantity: 2 }
    ]
  },
  {
    name: 'SAKE PARTY',
    price: 85000,
    originalPrice: 97000,
    discount: 12.4,
    image: 'https://placehold.co/400x300/FFA726/white?text=SAKE+PARTY',
    description: 'Combo đại tiệc cho nhóm bạn! Gồm 1 Sữa gạo Sa Kê, 1 Trà lá Sa Kê và 4 Mochi đa dạng hương vị. Tiết kiệm 12.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
    stock: 80,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    comboItems: [
      { itemName: 'Sữa gạo Sa Kê', quantity: 1 },
      { itemName: 'Trà lá Sa Kê', quantity: 1 },
      { itemName: 'Bánh Mochi', quantity: 4 }
    ]
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
    
    // Insert users (dùng create để hash password)
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    console.log(`✅ Đã thêm ${createdUsers.length} người dùng`);
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Đã thêm ${createdProducts.length} sản phẩm`);
    
    console.log('\n🎉 Seed database thành công!');
    console.log('\n📋 Thông tin đăng nhập:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@sakefruit.com');
    console.log('   Password: admin    node src/seeders/seedData.js123');
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
