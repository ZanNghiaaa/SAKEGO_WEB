# 🎯 HƯỚNG DẪN DEMO ADMIN DASHBOARD

## 📋 THÔNG TIN ĐĂNG NHẬP

### Tài khoản Admin
```
Email/Username: admin
Password: admin123
```

### Tài khoản User (để test đặt hàng)
```
Email/Username: user01
Password: user123
```

---

## 🚀 CÁCH DEMO HỆ THỐNG

### BƯỚC 1: ĐĂNG NHẬP ADMIN

1. Mở trình duyệt tại: `http://localhost:3001`
2. Click vào nút **"Đăng nhập"** ở góc trên bên phải (hoặc vào `/login`)
3. Nhập:
   - **Email hoặc Username:** `admin`
   - **Password:** `admin123`
4. Click **"Đăng nhập"**
5. Sau khi đăng nhập thành công, bạn sẽ thấy tên "Quản trị viên" ở góc trên

---

### BƯỚC 2: VÀO TRANG ADMIN DASHBOARD

**QUAN TRỌNG:** Sau khi đăng nhập, có 2 cách vào Admin Dashboard:

#### Cách 1: Thay đổi URL trực tiếp
- Ở thanh địa chỉ trình duyệt, gõ: `http://localhost:3001/admin`
- Nhấn Enter

#### Cách 2: Thêm link vào Navbar (khuyến nghị)
- Tôi sẽ thêm nút "Admin Panel" vào Navbar khi đăng nhập là admin
- Bạn chỉ cần click vào nút đó

---

### BƯỚC 3: KHÁM PHÁ ADMIN DASHBOARD

Khi vào `/admin`, bạn sẽ thấy:

#### 📊 **4 Thẻ Thống Kê (Stats Cards)**
- **Tổng đơn hàng** (màu xanh dương) - Hiển thị tổng số đơn và đơn hôm nay
- **Chờ xác nhận** (màu cam) - Số đơn cần xử lý
- **Đã hoàn thành** (màu xanh lá) - Tỷ lệ % hoàn thành
- **Doanh thu** (màu tím) - Tổng tiền từ đơn hoàn thành

#### 📋 **Tình Trạng Đơn Hàng**
Danh sách 6 trạng thái với số lượng:
- 🟡 Chờ xác nhận
- 🔵 Đã xác nhận  
- 🟠 Đang chuẩn bị
- 🟣 Đang giao hàng
- 🟢 Hoàn thành
- 🔴 Đã hủy

#### ⚡ **Thống Kê Nhanh**
- Số lượng sản phẩm
- Số khách hàng
- Số đơn đang giao

#### 🕐 **Đơn Hàng Gần Đây**
Bảng hiển thị 5 đơn mới nhất với:
- Mã đơn
- Tên khách hàng
- Số điện thoại
- Tổng tiền
- Trạng thái (có màu sắc)
- Thời gian đặt
- Nút "Xem chi tiết"

---

### BƯỚC 4: QUẢN LÝ ĐƠN HÀNG

1. Click vào **"Quản lý đơn hàng"** ở sidebar bên trái
2. Hoặc vào URL: `http://localhost:3001/admin/orders`

Tại đây bạn có thể:
- **Lọc đơn hàng** theo trạng thái (tabs ở trên)
- **Xem chi tiết** đơn hàng (nút mắt 👁️)
- **Cập nhật trạng thái** đơn hàng
- **Hủy đơn** hàng

#### Chi tiết modal khi click "Xem":
- Thông tin khách hàng (tên, SĐT, email, địa chỉ)
- Danh sách sản phẩm (hình ảnh, tên, số lượng, giá)
- Tổng tiền
- Lịch sử trạng thái (timeline)
- Nút cập nhật trạng thái tiếp theo

---

### BƯỚC 5: QUẢN LÝ SẢN PHẨM (CRUD)

1. Click vào **"Quản lý sản phẩm"** ở sidebar
2. Hoặc vào URL: `http://localhost:3001/admin/products`

#### Chức năng quản lý sản phẩm:

**📋 Xem danh sách:**
- Bảng hiển thị tất cả sản phẩm với: ID, hình ảnh, tên, danh mục, giá, tồn kho, trạng thái
- Filter theo danh mục: Tất cả, Mochi, Snack, Trà, Khô, Bánh Mật, Combo
- Tìm kiếm theo tên hoặc mô tả

**➕ Thêm sản phẩm:**
1. Click nút **"Thêm sản phẩm"** (góc trên bên phải)
2. Điền form:
   - Tên sản phẩm (bắt buộc)
   - Danh mục (dropdown)
   - Giá (VNĐ)
   - Tồn kho (số lượng)
   - URL hình ảnh
   - Mô tả
   - Checkbox: "Sản phẩm ăn liền" và "Gói dùng thử"
3. Click **"Thêm sản phẩm"**

**✏️ Chỉnh sửa sản phẩm:**
1. Click nút **icon bút** ở cột "Hành động"
2. Form hiện lên với dữ liệu sẵn
3. Sửa thông tin cần thiết
4. Click **"Cập nhật"**

**🗑️ Xóa sản phẩm:**
1. Click nút **icon thùng rác** ở cột "Hành động"
2. Xác nhận xóa
3. Sản phẩm bị xóa khỏi danh sách

---

### BƯỚC 6: QUẢN LÝ NGƯỜI DÙNG

1. Click vào **"Quản lý người dùng"** ở sidebar
2. Hoặc vào URL: `http://localhost:3001/admin/users`

#### Chức năng quản lý người dùng:

**📊 Thống kê:**
- Tổng người dùng
- Số khách hàng
- Số quản trị viên

**📋 Xem danh sách:**
- Bảng hiển thị: ID, tên, username, email, SĐT, vai trò, ngày tạo, số đơn hàng
- Filter theo vai trò: Tất cả, Khách hàng, Quản trị viên
- Tìm kiếm theo tên, email, username, SĐT

**👁️ Xem chi tiết người dùng:**
1. Click nút **icon mắt** ở cột "Hành động"
2. Modal hiển thị:
   - Avatar và tên đầy đủ
   - Vai trò (Admin/Khách hàng)
   - Thông tin: ID, Username, Email, SĐT, Địa chỉ, Ngày tạo
   - Tổng số đơn hàng
   - Lịch sử đơn hàng (mã đơn, ngày, tổng tiền, trạng thái)

---

### BƯỚC 7: THÔNG BÁO REALTIME (Notification)

#### Chuẩn bị:
1. Mở 2 tab trình duyệt
2. **Tab 1:** Đăng nhập admin, vào `/admin`
3. **Tab 2:** Đăng nhập user (user01/user123)

#### Test notification:
1. Ở **Tab 2 (User):**
   - Thêm sản phẩm vào giỏ
   - Vào trang Checkout (`/checkout`)
   - Điền thông tin giao hàng (chọn quận ở Cần Thơ)
   - Nhấn "Đặt hàng"

2. Ở **Tab 1 (Admin):**
   - Ngay lập tức sẽ thấy:
     - 🔔 **Chuông thông báo** (góc trên) có số đỏ
     - 🔊 **Âm thanh** thông báo
     - 📢 **Browser notification** (nếu đã cho phép)
     - 📊 **Dashboard tự động refresh** (số liệu cập nhật)

3. Click vào **icon chuông 🔔** để xem chi tiết thông báo

---

### BƯỚC 8: LUỒNG XỬ LÝ ĐƠN HÀNG ĐẦY ĐỦ

#### Workflow chuẩn:
```
1. 🟡 Chờ xác nhận (pending)
   ↓ Admin click "Xác nhận"
   
2. 🔵 Đã xác nhận (confirmed)
   ↓ Admin click "Chuẩn bị"
   
3. 🟠 Đang chuẩn bị (preparing)
   ↓ Admin click "Giao hàng"
   
4. 🟣 Đang giao hàng (delivering)
   ↓ Admin click "Hoàn thành"
   
5. 🟢 Hoàn thành (completed)
```

#### Test workflow:
1. Vào `/admin/orders`
2. Tìm đơn có trạng thái "Chờ xác nhận"
3. Click nút "👁️ Xem"
4. Trong modal, click **"Xác nhận đơn hàng"**
5. Modal đóng, bảng tự động cập nhật
6. Đơn chuyển sang tab "Đã xác nhận"
7. Lặp lại để chuyển qua các trạng thái tiếp theo

---

### BƯỚC 9: XEM LỊCH SỬ ĐƠN HÀNG (USER)

1. Đăng xuất admin
2. Đăng nhập lại bằng **user01/user123**
3. Click vào **"Tài khoản"** → **"Đơn hàng của tôi"**
4. Hoặc vào: `http://localhost:3001/profile`

Tại đây user sẽ thấy:
- Tất cả đơn hàng đã đặt
- Trạng thái hiện tại (có màu sắc)
- Chi tiết sản phẩm
- Địa chỉ giao hàng
- Tổng tiền

---

## 🎨 DEMO TRỰC QUAN

### Màu sắc trạng thái:
- 🟡 **Vàng** - Chờ xác nhận (cần xử lý gấp)
- 🔵 **Xanh dương** - Đã xác nhận
- 🟠 **Cam** - Đang chuẩn bị
- 🟣 **Tím** - Đang giao hàng
- 🟢 **Xanh lá** - Hoàn thành
- 🔴 **Đỏ** - Đã hủy

### Icon chức năng:
- 👁️ **Mắt** - Xem chi tiết
- ⏭️ **Mũi tên** - Chuyển trạng thái tiếp theo
- ❌ **X** - Hủy đơn
- 🔔 **Chuông** - Thông báo
- 📊 **Biểu đồ** - Thống kê

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Chỉ giao hàng tại Cần Thơ**
   - Khi checkout, dropdown chỉ có 9 quận của Cần Thơ
   - Không thể chọn tỉnh/thành khác

### 2. **Sản phẩm ăn liền**
   - Tất cả 13 sản phẩm đều có badge "🍴 Ăn liền"
   - Mô tả sản phẩm nhấn mạnh tính tiện lợi

### 3. **Quyền truy cập Admin**
   - Chỉ user có `role: 'admin'` mới vào được `/admin`
   - User thường sẽ bị redirect về trang chủ

### 4. **Notification cần phép browser**
   - Lần đầu sẽ hỏi "Allow notifications"
   - Nhấn "Allow" để nhận thông báo desktop

### 5. **LocalStorage data**
   - Tất cả dữ liệu lưu trong localStorage
   - Mở F12 → Application → Local Storage để xem:
     - `sakefruit_users` - Danh sách users
     - `sakefruit_current_user` - User đang đăng nhập
     - `sakefruit_orders` - Danh sách đơn hàng
     - `sakefruit_notifications` - Thông báo admin

---

## 🐛 KHẮC PHỤC SỰ CỐ

### "Tôi vào /admin nhưng không thấy gì"

**Nguyên nhân:** Chưa đăng nhập hoặc không phải admin

**Giải pháp:**
1. Mở F12 → Console
2. Gõ: `localStorage.getItem('sakefruit_current_user')`
3. Nếu null → Chưa đăng nhập → Vào `/login`
4. Nếu có user nhưng `role !== 'admin'` → Đăng xuất và login bằng `admin/admin123`

### "Dashboard không có dữ liệu"

**Nguyên nhân:** Chưa có đơn hàng nào

**Giải pháp:**
1. Đăng xuất admin
2. Đăng nhập user (user01/user123)
3. Đặt 2-3 đơn hàng thử
4. Đăng nhập lại admin
5. Dashboard sẽ hiển thị số liệu

### "Không nhận được notification"

**Giải pháp:**
1. Check browser đã cho phép notification chưa
2. Đảm bảo admin đang ở trang `/admin` hoặc `/admin/orders`
3. Mở Console xem có lỗi không
4. Test bằng cách đặt đơn từ tab khác

---

## 📸 CHECKLIST DEMO

Khi demo cho khách hàng/giảng viên, hãy show:

- [ ] Login thành công bằng admin/admin123
- [ ] Dashboard hiển thị đầy đủ 4 stats cards
- [ ] Bảng "Tình trạng đơn hàng" với 6 trạng thái
- [ ] Bảng "Đơn hàng gần đây" (nếu có data)
- [ ] **QUẢN LÝ ĐƠN HÀNG:**
  - [ ] Click vào "Quản lý đơn hàng" → Hiện bảng orders
  - [ ] Filter orders theo status tabs
  - [ ] Click "Xem" → Modal hiện chi tiết
  - [ ] Cập nhật trạng thái đơn hàng → Modal đóng, bảng refresh
- [ ] **QUẢN LÝ SẢN PHẨM (CRUD):**
  - [ ] Click "Quản lý sản phẩm" → Hiện bảng products
  - [ ] Filter theo danh mục (Mochi, Snack, etc.)
  - [ ] Tìm kiếm sản phẩm
  - [ ] Thêm sản phẩm mới → Form hiện lên → Nhập dữ liệu → Lưu
  - [ ] Sửa sản phẩm → Click icon bút → Sửa → Cập nhật
  - [ ] Xóa sản phẩm → Click icon thùng rác → Xác nhận
- [ ] **QUẢN LÝ NGƯỜI DÙNG:**
  - [ ] Click "Quản lý người dùng" → Hiện bảng users
  - [ ] Filter theo vai trò (Khách hàng/Admin)
  - [ ] Click "Xem" → Modal hiện thông tin user và lịch sử đơn
- [ ] **NOTIFICATION:**
  - [ ] Đặt đơn mới từ tab khác → Notification hiện lên
  - [ ] Click chuông → Dropdown thông báo
- [ ] Logout admin → Login user → Xem order history
- [ ] Checkout page chỉ có Cần Thơ districts
- [ ] Tất cả products có badge "Ăn liền"

---

## 🎓 GIẢI THÍCH KỸ THUẬT (Nếu hỏi)

### Công nghệ sử dụng:
- **React 18** - UI framework
- **React Router v6** - Routing
- **LocalStorage** - Data persistence
- **CustomEvent API** - Real-time notifications
- **Browser Notification API** - Desktop alerts

### Kiến trúc:
```
src/
├── controllers/        # Business logic
│   ├── UserController.js
│   ├── OrderController.js
│   └── NotificationController.js
├── pages/              # Page components
│   ├── AdminDashboard.jsx
│   └── AdminOrders.jsx
├── components/         # Reusable components
│   └── AdminLayout.jsx
└── assets/css/         # Styling
    └── admin-dashboard.css
```

### Order Status Flow:
```javascript
pending → confirmed → preparing → delivering → completed
                                              ↘ cancelled
```

---

## 🚀 CHẠY PROJECT

```bash
# Cài dependencies (nếu chưa)
npm install

# Chạy dev server
npm run dev

# Mở trình duyệt
http://localhost:3001
```

---

**🎉 CHÚC BẠN DEMO THÀNH CÔNG!**

Nếu có vấn đề, check:
1. Console có lỗi không (F12)
2. LocalStorage có dữ liệu không
3. Đã đăng nhập đúng admin chưa
4. URL có đúng `/admin` không
