# 🌿 SaKeFruit - Hệ Thống Quản Lý Bán Hàng Sa Kê

## 📌 Tổng Quan Dự Án

**SaKeFruit** là hệ thống web bán hàng đặc sản Sa Kê với 2 giao diện:
- 🛍️ **Giao diện User**: Mua sắm trực tuyến, đặt hàng
- ⚙️ **Giao diện Admin**: Quản lý đơn hàng, sản phẩm, người dùng

### 🎯 Đặc điểm chính:
- ✅ **Bán trực tiếp tại Cần Thơ**: Chỉ giao hàng trong 9 quận của TP. Cần Thơ
- ✅ **Sản phẩm ăn liền**: Tất cả sản phẩm đều ready-to-eat, tiện lợi
- ✅ **Hệ thống Admin đầy đủ**: CRUD sản phẩm, quản lý đơn hàng, quản lý user
- ✅ **Thông báo realtime**: Admin nhận thông báo ngay khi có đơn hàng mới

---

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: React 18 + React Router DOM v6
- **State Management**: Context API (CartContext)
- **Storage**: LocalStorage (users, orders, products, notifications)
- **Styling**: Custom CSS (Modular)
- **Build Tool**: Vite
- **Icons**: Font Awesome
- **Notifications**: Browser Notification API + CustomEvent

---

## 📁 Cấu Trúc Project

```
SaKeFruitWeb-React/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # User layout wrapper
│   │   ├── AdminLayout.jsx  # Admin layout with sidebar
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── ...
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── AdminDashboard.jsx    # Admin overview
│   │   ├── AdminOrders.jsx       # Order management
│   │   ├── AdminProducts.jsx     # Product CRUD
│   │   └── AdminUsers.jsx        # User management
│   │
│   ├── controllers/         # Business logic
│   │   ├── UserController.js         # Auth, user CRUD
│   │   ├── OrderController.js        # Order management
│   │   ├── ProductController.js      # Product CRUD
│   │   └── NotificationController.js # Real-time notifications
│   │
│   ├── context/
│   │   └── CartContext.jsx  # Shopping cart state
│   │
│   ├── assets/
│   │   ├── css/             # Modular CSS files
│   │   └── images/
│   │
│   ├── App.jsx              # Main app with routes
│   └── main.jsx             # Entry point
│
├── public/
│   └── assets/images/
│
├── ADMIN_DEMO_GUIDE.md      # Hướng dẫn demo chi tiết
├── package.json
└── vite.config.js
```

---

## 🔑 Tài Khoản Mặc Định

### Admin
```
Email/Username: admin
Password: admin123
Role: admin
```

### User
```
Email/Username: user01
Password: user123
Role: customer
```

---

## 📦 Cài Đặt & Chạy

### 1. Clone hoặc mở project
```bash
cd d:\FALL25\EXE101\project\SaKeFruitWeb-React
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy development server
```bash
npm run dev
```

### 4. Mở trình duyệt
```
http://localhost:3001
```
(Port có thể tự động chuyển sang 3001 nếu 3000 đang dùng)

---

## 🎨 Chức Năng Chính

### 👤 **USER (Khách hàng)**

#### 1. Mua sắm
- Xem danh sách sản phẩm Sa Kê (13 sản phẩm)
- Lọc theo danh mục: Mochi, Snack, Trà, Khô, Bánh Mật, Combo
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm

#### 2. Giỏ hàng
- Thêm/Xóa/Cập nhật số lượng
- Xem tổng tiền
- Checkout

#### 3. Đặt hàng
- Điền thông tin giao hàng
- **Chỉ giao tại 9 quận Cần Thơ**:
  - Ninh Kiều, Bình Thủy, Cái Răng, Ô Môn
  - Thốt Nốt, Phong Điền, Cờ Đỏ, Vĩnh Thạnh, Thới Lai
- Chọn phương thức thanh toán (COD/Chuyển khoản)
- Nhận mã đơn hàng

#### 4. Quản lý tài khoản
- Xem thông tin cá nhân
- Lịch sử đơn hàng với 6 trạng thái:
  - 🟡 Chờ xác nhận
  - 🔵 Đã xác nhận
  - 🟠 Đang chuẩn bị
  - 🟣 Đang giao hàng
  - 🟢 Hoàn thành
  - 🔴 Đã hủy

---

### ⚙️ **ADMIN (Quản trị viên)**

#### 1. Dashboard (Tổng quan)
📍 Route: `/admin`

**Statistics Cards:**
- Tổng đơn hàng (+ đơn hôm nay)
- Đơn chờ xác nhận
- Đơn đã hoàn thành (+ tỷ lệ %)
- Tổng doanh thu

**Tình trạng đơn hàng:**
- Số lượng đơn theo từng trạng thái

**Thống kê nhanh:**
- Số lượng sản phẩm
- Số khách hàng
- Số đơn đang giao

**Đơn hàng gần đây:**
- Bảng 5 đơn mới nhất

---

#### 2. Quản Lý Đơn Hàng
📍 Route: `/admin/orders`

**Chức năng:**
- ✅ Xem danh sách tất cả đơn hàng
- ✅ Lọc theo trạng thái (tabs)
- ✅ Xem chi tiết đơn hàng (modal)
  - Thông tin khách hàng
  - Danh sách sản phẩm
  - Tổng tiền
  - Lịch sử trạng thái (timeline)
- ✅ Cập nhật trạng thái đơn hàng
  - pending → confirmed → preparing → delivering → completed
- ✅ Hủy đơn hàng (status: cancelled)
- ✅ Tự động refresh khi có đơn mới

---

#### 3. Quản Lý Sản Phẩm (CRUD)
📍 Route: `/admin/products`

**Chức năng:**

**📋 READ - Xem danh sách:**
- Bảng hiển thị: ID, hình ảnh, tên, danh mục, giá, tồn kho, trạng thái
- Filter theo danh mục (7 categories)
- Tìm kiếm theo tên/mô tả
- Badge: "Dùng thử" và "Ăn liền"

**➕ CREATE - Thêm sản phẩm:**
1. Click nút "Thêm sản phẩm"
2. Form modal hiện lên với fields:
   - Tên sản phẩm *
   - Danh mục (dropdown) *
   - Giá (VNĐ) *
   - Tồn kho *
   - URL hình ảnh
   - Mô tả *
   - Checkbox: Sản phẩm ăn liền
   - Checkbox: Gói dùng thử
3. Submit → Sản phẩm được thêm vào localStorage
4. Bảng tự động refresh

**✏️ UPDATE - Chỉnh sửa:**
1. Click icon bút chì (Edit)
2. Form modal hiện với dữ liệu sẵn
3. Sửa thông tin
4. Submit → Cập nhật localStorage
5. Bảng refresh

**🗑️ DELETE - Xóa sản phẩm:**
1. Click icon thùng rác (Delete)
2. Xác nhận xóa
3. Sản phẩm bị xóa khỏi localStorage
4. Bảng refresh

**Dữ liệu lưu trong:** `localStorage.sakefruit_products`

---

#### 4. Quản Lý Người Dùng
📍 Route: `/admin/users`

**Chức năng:**

**📊 Statistics:**
- Tổng người dùng
- Số khách hàng
- Số quản trị viên

**📋 Xem danh sách:**
- Bảng hiển thị: ID, tên, username, email, SĐT, vai trò, ngày tạo, số đơn
- Filter theo vai trò: Tất cả | Khách hàng | Admin
- Tìm kiếm theo: tên, email, username, SĐT

**👁️ Xem chi tiết user:**
Modal hiển thị:
- Avatar (chữ cái đầu)
- Tên đầy đủ
- Vai trò (badge màu)
- Thông tin cá nhân:
  - ID
  - Username
  - Email
  - Số điện thoại
  - Địa chỉ
  - Ngày tạo
- Thống kê đơn hàng:
  - Tổng số đơn
  - Lịch sử đơn hàng (mã, ngày, số tiền, trạng thái)

---

#### 5. Hệ Thống Thông Báo Realtime
📍 Hiển thị: Sidebar (icon chuông)

**Chức năng:**
- ✅ **Realtime notification** khi có đơn hàng mới
- ✅ **Browser notification** (desktop alert)
- ✅ **Âm thanh** thông báo
- ✅ **Badge đỏ** hiện số thông báo chưa đọc
- ✅ **Dropdown** xem chi tiết thông báo
- ✅ **Đánh dấu đã đọc** (từng cái hoặc tất cả)
- ✅ **Auto-refresh** Dashboard và Orders khi có đơn mới

**Cách hoạt động:**
1. User đặt hàng → `sendOrderNotification()` được gọi
2. Notification lưu vào localStorage
3. CustomEvent `'newNotification'` được dispatch
4. Admin nghe event → Cập nhật UI
5. Browser notification hiển thị
6. Âm thanh "beep" phát ra

**Dữ liệu lưu trong:** `localStorage.sakefruit_notifications`

---

## 🗂️ Controllers (Business Logic)

### 1. UserController.js
**Chức năng:**
- `loginUser(emailOrUsername, password)` - Đăng nhập (hỗ trợ email hoặc username)
- `registerUser(userData)` - Đăng ký tài khoản mới
- `logoutUser()` - Đăng xuất
- `getCurrentUser()` - Lấy user hiện tại
- `updateUserProfile(userId, updates)` - Cập nhật profile
- `isAdmin()` - Kiểm tra quyền admin
- `isCustomer()` - Kiểm tra quyền customer
- `getUsers()` - Lấy danh sách users

**Default users:**
- admin/admin123 (role: admin)
- user01/user123 (role: customer)

**LocalStorage:** `sakefruit_users`, `sakefruit_current_user`

---

### 2. OrderController.js
**Chức năng:**
- `createOrder(orderData)` - Tạo đơn hàng (auto-gen ID: ORD+timestamp)
- `getAllOrders()` - Lấy tất cả đơn
- `getOrderById(orderId)` - Lấy đơn theo ID
- `getOrdersByUserId(userId)` - Lấy đơn của user
- `updateOrderStatus(orderId, newStatus, note)` - Cập nhật trạng thái
- `getOrdersStatistics()` - Thống kê (total, pending, completed, revenue...)
- `getTodayOrders()` - Đơn hôm nay

**Order Status Flow:**
```
pending → confirmed → preparing → delivering → completed
                                              ↘ cancelled
```

**CAN_THO_DISTRICTS:** Array 9 quận

**ORDER_STATUS_TEXT:** Map status → text tiếng Việt

**LocalStorage:** `sakefruit_orders`

---

### 3. ProductController.js
**Chức năng:**
- `getAllProducts()` - Lấy tất cả sản phẩm
- `getProductById(id)` - Lấy sản phẩm theo ID
- `getProductsByCategory(category)` - Lọc theo danh mục
- `searchProducts(searchTerm)` - Tìm kiếm
- `addProduct(productData)` - Thêm sản phẩm mới
- `updateProduct(id, updates)` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `getProductCategories()` - Lấy categories với count

**Default products:** 13 sản phẩm (Mochi, Snack, Trà, Khô, Bánh Mật, Combo)

**LocalStorage:** `sakefruit_products`

---

### 4. NotificationController.js
**Chức năng:**
- `sendOrderNotification(order)` - Gửi thông báo đơn hàng mới
- `getNotifications()` - Lấy danh sách thông báo
- `getUnreadCount()` - Đếm thông báo chưa đọc
- `markAsRead(notifId)` - Đánh dấu đã đọc (1 cái)
- `markAllAsRead()` - Đánh dấu tất cả
- `requestNotificationPermission()` - Xin quyền browser notification

**Events:**
- CustomEvent: `'newNotification'`
- CustomEvent: `'notificationRead'`

**LocalStorage:** `sakefruit_notifications`

---

## 🎨 UI/UX Features

### Responsive Design
- Desktop (>1200px)
- Tablet (768px - 1200px)
- Mobile (<768px)

### Color Scheme
- **Primary**: Gradient purple-blue (#667eea → #764ba2)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF9800)
- **Danger**: Red (#f44336)
- **Info**: Blue (#2196F3)

### Status Colors
- 🟡 Pending: Yellow (#FFC107)
- 🔵 Confirmed: Blue (#2196F3)
- 🟠 Preparing: Orange (#FF9800)
- 🟣 Delivering: Purple (#9C27B0)
- 🟢 Completed: Green (#4CAF50)
- 🔴 Cancelled: Red (#f44336)

### Components
- Stat Cards với gradient
- Modal overlay với animation
- Notification dropdown
- Sidebar navigation
- Filter tabs
- Search box
- Badge và Labels
- Timeline (order history)
- Loading spinner

---

## 📚 Hướng Dẫn Sử Dụng

### Đối với User:
1. Truy cập `http://localhost:3001`
2. Đăng ký tài khoản hoặc login
3. Browse sản phẩm, thêm vào giỏ
4. Checkout → Chọn quận Cần Thơ
5. Đặt hàng → Nhận mã đơn
6. Vào Profile → Xem lịch sử đơn

### Đối với Admin:
1. Login với `admin/admin123`
2. Click tên user → Menu → "Admin Panel"
3. **Dashboard**: Xem tổng quan
4. **Quản lý đơn hàng**: Xử lý đơn, cập nhật trạng thái
5. **Quản lý sản phẩm**: CRUD sản phẩm
6. **Quản lý người dùng**: Xem thông tin user
7. **Thông báo**: Nhận alert khi có đơn mới

📖 **Xem chi tiết:** [ADMIN_DEMO_GUIDE.md](./ADMIN_DEMO_GUIDE.md)

---

## 🔒 LocalStorage Structure

```javascript
{
  sakefruit_users: [
    { id, username, password, fullname, email, phone, address, role, createdAt }
  ],
  
  sakefruit_current_user: {
    id, username, fullname, email, phone, address, role
  },
  
  sakefruit_products: [
    { id, name, price, image, description, category, stock, isTrial, isReadyToEat }
  ],
  
  sakefruit_orders: [
    { 
      id, userId, items, totalAmount, customerInfo, 
      paymentMethod, status, createdAt, statusHistory 
    }
  ],
  
  sakefruit_notifications: [
    { id, title, message, orderId, orderData, isRead, createdAt }
  ]
}
```

---

## 🐛 Khắc Phục Sự Cố

### "Không vào được Admin Panel"
**Giải pháp:**
- Đảm bảo đã login với `admin/admin123`
- Check Console (F12) xem có lỗi không
- Kiểm tra localStorage: `localStorage.getItem('sakefruit_current_user')`
- Role phải là `'admin'`

### "Dashboard không có dữ liệu"
**Giải pháp:**
- Cần có ít nhất 1 đơn hàng
- Login user → Đặt 2-3 đơn thử
- Login lại admin → Dashboard hiển thị

### "Không nhận notification"
**Giải pháp:**
- Cho phép browser notification khi hỏi
- Đảm bảo admin đang ở trang `/admin` hoặc `/admin/orders`
- Check Console có lỗi không

### "CRUD sản phẩm không hoạt động"
**Giải pháp:**
- Check localStorage: `localStorage.getItem('sakefruit_products')`
- Clear localStorage và reload: `localStorage.clear()` → F5
- Dữ liệu sẽ tự động khởi tạo lại

---

## 📝 TODO / Future Features

- [ ] Upload hình ảnh sản phẩm thay vì URL
- [ ] Export đơn hàng ra Excel/PDF
- [ ] Chart/Graph thống kê doanh thu
- [ ] Email confirmation khi đặt hàng
- [ ] SMS notification
- [ ] Admin có thể khóa/mở khóa user
- [ ] Promotion/Discount system
- [ ] Inventory warning (tồn kho thấp)
- [ ] Mobile app version

---

## 👨‍💻 Developer

**Project:** SaKeFruit E-Commerce
**Course:** EXE101 - FALL 2025
**Tech Stack:** React 18 + Vite + LocalStorage

---

## 📄 License

This project is for educational purposes (EXE101 course project).

---

**🎉 Happy Coding!**

Nếu có thắc mắc, tham khảo [ADMIN_DEMO_GUIDE.md](./ADMIN_DEMO_GUIDE.md) để biết chi tiết cách demo từng chức năng.
