# 🔄 Backend Integration Guide

## 📢 Thông báo quan trọng

Backend API đã được tạo hoàn chỉnh tại thư mục `../SaKeFruitWeb-Backend`

## 🚀 Bước 1: Khởi động Backend

```bash
# Chuyển sang thư mục backend
cd ../SaKeFruitWeb-Backend

# Cài đặt dependencies (lần đầu)
npm install

# Tạo file .env (đã có sẵn)
# Kiểm tra file .env đã đúng cấu hình chưa

# Khởi động MongoDB (Windows)
net start MongoDB

# Seed dữ liệu mẫu (lần đầu)
npm run seed

# Chạy backend server
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

## 🔧 Bước 2: Cập nhật Frontend

### 2.1. Tạo file cấu hình API

Tạo file `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
      ...options.headers
    };

    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra!');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();
export default api;
```

### 2.2. Tạo file .env

Tạo file `.env` trong thư mục frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2.3. Cập nhật Controllers

**Chi tiết đầy đủ xem trong backend:**
```
../SaKeFruitWeb-Backend/FRONTEND_UPDATE_GUIDE.md
```

**Tóm tắt các file cần cập nhật:**

1. ✅ `src/controllers/UserController.js` - Thay localStorage bằng API calls
2. ✅ `src/controllers/ProductController.js` - Thay localStorage bằng API calls  
3. ✅ `src/controllers/OrderController.js` - Thay localStorage bằng API calls
4. ✅ `src/pages/Checkout.jsx` - Update hàm tạo order
5. ✅ Admin pages - Update để gọi API

## 📚 Tài liệu đầy đủ

Xem file chi tiết tại backend:
- `../SaKeFruitWeb-Backend/FRONTEND_UPDATE_GUIDE.md` - Hướng dẫn cập nhật từng file
- `../SaKeFruitWeb-Backend/README.md` - API documentation
- `../SaKeFruitWeb-Backend/QUICKSTART.md` - Quick start guide

## 🧪 Test Integration

1. ✅ Backend đang chạy tại http://localhost:5000
2. ✅ Frontend đang chạy tại http://localhost:5173
3. ✅ Test đăng nhập
4. ✅ Test xem sản phẩm
5. ✅ Test đặt hàng

## 👤 Tài khoản test

**Admin:**
- Email: admin@sakefruit.com
- Password: admin123

**Customer:**
- Email: user01@gmail.com
- Password: user123

## 🔗 API Endpoints

Base URL: http://localhost:5000/api

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /products` - Danh sách sản phẩm
- `POST /orders` - Tạo đơn hàng
- `GET /orders/my-orders` - Đơn hàng của tôi
- `GET /admin/orders` - Quản lý đơn (Admin)
- ... và nhiều endpoints khác

## ⚠️ Lưu ý

- Đảm bảo backend đang chạy trước khi test frontend
- MongoDB phải được khởi động
- Đã seed dữ liệu mẫu

---

**Backend repository:** `../SaKeFruitWeb-Backend`
