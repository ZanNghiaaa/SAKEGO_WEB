import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import userRoutes from './src/routes/users.js';
import adminRoutes from './src/routes/admin.js';
import uploadRoutes from './src/routes/upload.js';

// Import error handler
import errorHandler from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sakego.com.vn',
  'https://www.sakego.com.vn'
];

// Hỗ trợ thêm origin từ env (phân cách bởi dấu phẩy) - dùng khi deploy lên Vercel
const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SaKeFruit API Server is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   🍊 SaKeFruit Backend API Server 🍊        ║
╠═══════════════════════════════════════════════╣
║   Server: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                   ║
║   Database: MongoDB                           ║
╚═══════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export default app;
