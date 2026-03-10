import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Order from './src/models/Order.js';

dotenv.config();

// Dữ liệu người dùng mẫu
const users = [
  {
    username: 'admin',
    email: 'admin@sakefruit.com',
    password: 'admin123',
    fullname: 'Quản trị viên SaKe',
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
  },
  {
    username: 'nguyenvantuan',
    email: 'tuan.nguyen@gmail.com',
    password: 'tuan123',
    fullname: 'Nguyễn Văn Tuấn',
    phone: '0912345678',
    address: '789 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ',
    role: 'customer'
  }
];

// Dữ liệu sản phẩm mẫu
const products = [
  // TRÀ SA KÊ
  {
    name: 'Trà Sa Kê Ô Long Cao Cấp',
    price: 45000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-oolong.jpg',
    description: 'Trà Sa Kê Ô Long được chế biến từ lá trà Ô Long cao cấp kết hợp với sa kê truyền thống. Hương thơm đặc trưng, vị thanh mát, giúp thư giãn tinh thần. Hộp 100g (20 túi lọc)',
    category: 'tea',
    stock: 150,
    isTrial: false,
    isReadyToEat: false
  },
  {
    name: 'Trà Sa Kê Sen Việt',
    price: 42000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-sen.jpg',
    description: 'Trà Sa Kê hương sen thanh nhã, dễ uống. Kết hợp tinh hoa trà sen Việt Nam và sa kê Nhật Bản. Thích hợp thưởng thức buổi sáng hoặc chiều tối. Hộp 100g (20 túi lọc)',
    category: 'tea',
    stock: 120,
    isTrial: false,
    isReadyToEat: false
  },
  {
    name: 'Trà Sa Kê Lài Hoa',
    price: 38000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-lai.jpg',
    description: 'Trà Sa Kê hoa lài thơm dịu nhẹ, thanh khiết. Giúp giảm stress, tốt cho sức khỏe. Phù hợp để uống hàng ngày. Hộp 100g (20 túi lọc)',
    category: 'tea',
    stock: 100,
    isTrial: false,
    isReadyToEat: false
  },
  {
    name: 'Trà Sa Kê Trà Xanh Matcha',
    price: 52000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/tra-matcha.jpg',
    description: 'Trà Sa Kê Matcha nguyên chất từ Nhật Bản. Giàu chất chống oxi hóa, tốt cho sức khỏe. Vị đắng nhẹ hòa quyện sa kê thơm nồng. Hộp 80g (16 túi lọc)',
    category: 'tea',
    stock: 80,
    isTrial: false,
    isReadyToEat: false
  },
  
  // SỮA GẠO SA KÊ
  {
    name: 'Sữa Gạo Sa Kê Nguyên Chất',
    price: 25000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-nguyen-chat.jpg',
    description: 'Sữa gạo Sa Kê được làm từ gạo ST25 và sa kê truyền thống. Không đường, không chất bảo quản. Giàu dinh dưỡng, dễ tiêu hóa. Chai 300ml',
    category: 'rice-milk',
    stock: 200,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Sữa Gạo Sa Kê Vị Dâu',
    price: 28000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-dau.jpg',
    description: 'Sữa gạo Sa Kê vị dâu tươi ngọt thanh. Kết hợp hoàn hảo giữa sữa gạo dinh dưỡng và hương dâu thơm ngon. Phù hợp cho mọi lứa tuổi. Chai 300ml',
    category: 'rice-milk',
    stock: 180,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Sữa Gạo Sa Kê Vị Matcha',
    price: 30000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-matcha.jpg',
    description: 'Sữa gạo Sa Kê kết hợp matcha Nhật Bản. Vị đắng nhẹ của matcha hòa quyện sữa gạo béo ngậy. Tốt cho sức khỏe, tăng cường năng lượng. Chai 300ml',
    category: 'rice-milk',
    stock: 150,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Sữa Gạo Sa Kê Vị Cacao',
    price: 28000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-cacao.jpg',
    description: 'Sữa gạo Sa Kê hương cacao thơm ngon. Giàu chất xơ và protein thực vật. Phù hợp cho người ăn chay và người muốn giảm cân. Chai 300ml',
    category: 'rice-milk',
    stock: 170,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Sữa Gạo Sa Kê Yến Mạch',
    price: 32000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/sua-gao-yen-mach.jpg',
    description: 'Sữa gạo Sa Kê kết hợp yến mạch dinh dưỡng. Tăng cường sức khỏe tim mạch, giảm cholesterol. Bữa sáng lý tưởng mỗi ngày. Chai 300ml',
    category: 'rice-milk',
    stock: 140,
    isTrial: false,
    isReadyToEat: true
  },
  
  // BÁNH MOCHI SA KÊ
  {
    name: 'Bánh Mochi Sa Kê Nhân Dâu',
    price: 35000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-dau.jpg',
    description: 'Bánh Mochi Sa Kê nhân dâu tươi ngon, mềm mịn. Vị ngọt thanh của dâu hòa quyện với sa kê thơm nồng. Công thức Nhật Bản truyền thống. Hộp 6 viên (180g)',
    category: 'mochi',
    stock: 120,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi Sa Kê Nhân Matcha',
    price: 38000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-matcha.jpg',
    description: 'Bánh Mochi Sa Kê nhân matcha Nhật Bản cao cấp. Vị đắng nhẹ của matcha kết hợp sa kê độc đáo. Làm từ bột gạo nếp thượng hạng. Hộp 6 viên (180g)',
    category: 'mochi',
    stock: 100,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi Sa Kê Nhân Trà Xanh',
    price: 35000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-tra-xanh.jpg',
    description: 'Bánh Mochi Sa Kê nhân trà xanh thanh mát. Hương trà xanh dịu nhẹ, hòa quyện sa kê thơm lừng. Mềm dai, ngọt vừa phải. Hộp 6 viên (180g)',
    category: 'mochi',
    stock: 130,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi Sa Kê Nhân Đậu Đỏ',
    price: 36000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-dau-do.jpg',
    description: 'Bánh Mochi Sa Kê nhân đậu đỏ truyền thống Nhật Bản. Nhân đậu đỏ bùi béo, ngọt thanh. Làm thủ công theo công thức cổ điển. Hộp 6 viên (180g)',
    category: 'mochi',
    stock: 110,
    isTrial: false,
    isReadyToEat: true
  },
  {
    name: 'Bánh Mochi Sa Kê Nhân Mè Đen',
    price: 37000,
    image: 'https://res.cloudinary.com/demo/image/upload/v1/sakefruit/mochi-me-den.jpg',
    description: 'Bánh Mochi Sa Kê nhân mè đen thơm bùi. Giàu canxi và vitamin E. Vị mè đen đậm đà kết hợp sa kê độc đáo. Hộp 6 viên (180g)',
    category: 'mochi',
    stock: 95,
    isTrial: false,
    isReadyToEat: true
  }
];

// Hàm kết nối MongoDB với database sakego
const connectDB = async () => {
  try {
    // Tạo URI cho database sakego (sử dụng 127.0.0.1 thay vì localhost để tránh IPv6)
    const mongoURI = 'mongodb://127.0.0.1:27017/sakego';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Hàm seed dữ liệu
const seedDatabase = async () => {
  try {
    console.log('🚀 Bắt đầu tạo database sakego...\n');

    // Kết nối database
    await connectDB();

    // Xóa dữ liệu cũ
    console.log('🗑️  Xóa dữ liệu cũ...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // Tạo người dùng
    console.log('👥 Tạo người dùng...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Đã tạo ${createdUsers.length} người dùng\n`);

    // Tạo sản phẩm
    console.log('📦 Tạo sản phẩm...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Đã tạo ${createdProducts.length} sản phẩm\n`);

    // Tạo đơn hàng mẫu
    console.log('🛒 Tạo đơn hàng mẫu...');
    const customerUser = createdUsers.find(u => u.role === 'customer');
    const sampleProducts = createdProducts.slice(0, 3);

    const sampleOrder = {
      orderNumber: 'ORD' + Date.now(),
      userId: customerUser._id,
      customerInfo: {
        fullname: customerUser.fullname,
        email: customerUser.email,
        phone: customerUser.phone,
        address: customerUser.address,
        district: 'Ninh Kiều',
        ward: 'Xuân Khánh',
        notes: 'Giao hàng giờ hành chính'
      },
      items: sampleProducts.map(p => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: 2,
        image: p.image,
        category: p.category
      })),
      totalAmount: sampleProducts.reduce((sum, p) => sum + (p.price * 2), 0),
      paymentMethod: 'cod',
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Đơn hàng được tạo'
      }]
    };

    const createdOrder = await Order.create(sampleOrder);
    console.log(`✅ Đã tạo 1 đơn hàng mẫu\n`);

    // Thống kê
    console.log('📊 THỐNG KÊ DATABASE SAKEGO:');
    console.log('================================');
    console.log(`👥 Người dùng: ${createdUsers.length}`);
    console.log(`   - Admin: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   - Customer: ${createdUsers.filter(u => u.role === 'customer').length}`);
    console.log(`📦 Sản phẩm: ${createdProducts.length}`);
    console.log(`   - Trà Sa Kê: ${createdProducts.filter(p => p.category === 'tea').length}`);
    console.log(`   - Sữa Gạo Sa Kê: ${createdProducts.filter(p => p.category === 'rice-milk').length}`);
    console.log(`   - Bánh Mochi Sa Kê: ${createdProducts.filter(p => p.category === 'mochi').length}`);
    console.log(`🛒 Đơn hàng: 1`);
    console.log('================================\n');

    console.log('🎉 HOÀN THÀNH! Database sakego đã được tạo thành công!');
    console.log('\n📝 THÔNG TIN ĐĂNG NHẬP:');
    console.log('================================');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\nCustomer 1:');
    console.log('  Username: user01');
    console.log('  Password: user123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
};

// Chạy seed
seedDatabase();
