# 🧪 HƯỚNG DẪN TEST CHỨC NĂNG WEBSITE SAKE FRUIT

## 📋 MỤC LỤC
1. [Khởi động Website](#1-khởi-động-website)
2. [Test Trang Chủ](#2-test-trang-chủ)
3. [Test Đăng Ký Tài Khoản](#3-test-đăng-ký-tài-khoản)
4. [Test Đăng Nhập](#4-test-đăng-nhập)
5. [Test Trang Sản Phẩm](#5-test-trang-sản-phẩm)
6. [Test Chi Tiết Sản Phẩm](#6-test-chi-tiết-sản-phẩm)
7. [Test Giỏ Hàng](#7-test-giỏ-hàng)
8. [Test Thanh Toán](#8-test-thanh-toán)
9. [Test Trang Profile](#9-test-trang-profile)
10. [Test Các Tính Năng Khác](#10-test-các-tính-năng-khác)

---

## 1. KHỞI ĐỘNG WEBSITE

### Bước 1: Mở Terminal trong VS Code
- Nhấn `Ctrl + ~` hoặc vào menu **Terminal → New Terminal**

### Bước 2: Chạy lệnh khởi động
```bash
npm run dev
```

### Bước 3: Kiểm tra
- ✅ Terminal hiển thị: `Local: http://localhost:3001/`
- ✅ Không có lỗi màu đỏ
- ✅ Website tự động mở trong trình duyệt

### Bước 4: Mở trong trình duyệt (nếu chưa tự động)
- Nhấn `Ctrl + Click` vào link `http://localhost:3001/`
- Hoặc gõ trực tiếp: `http://localhost:3001/` trong trình duyệt

---

## 2. TEST TRANG CHỦ

### 🎯 Mục tiêu: Kiểm tra giao diện và điều hướng trang chủ

### Test Case 2.1: Hiển thị Header
**Các bước:**
1. Mở trang chủ `http://localhost:3001/`
2. Quan sát phần header

**Kết quả mong đợi:**
- ✅ Logo "SAKE FRUIT" hiển thị bên trái
- ✅ Menu điều hướng: Trang Chủ, Sản Phẩm, Giới Thiệu, Liên Hệ
- ✅ Icon giỏ hàng và Profile ở góc phải
- ✅ Header có màu nền trắng, shadow đẹp

### Test Case 2.2: Hero Section
**Các bước:**
1. Cuộn đến phần hero (banner đầu trang)

**Kết quả mong đợi:**
- ✅ Background gradient màu xanh lá (#7CB342)
- ✅ Tiêu đề: "Bánh Mochi Sakefruit" màu trắng
- ✅ Mô tả sản phẩm hiển thị rõ ràng
- ✅ Nút "Mua Ngay" màu vàng nổi bật
- ✅ Ảnh sản phẩm hiển thị ở bên phải

### Test Case 2.3: Phần Thống Kê (Stats)
**Các bước:**
1. Cuộn xuống phần thống kê (dưới hero)

**Kết quả mong đợi:**
- ✅ Hiển thị 3 thẻ: Sản Phẩm, Khách Hàng, Đánh Giá
- ✅ Số liệu: 13+ Sản Phẩm, 1000+ Khách Hàng, 4.8★ Đánh Giá
- ✅ Icon đẹp, màu xanh lá
- ✅ Hiệu ứng hover khi di chuột

### Test Case 2.4: Danh Mục Sản Phẩm
**Các bước:**
1. Cuộn đến phần "Danh Mục Sản Phẩm"
2. Nhấn vào từng danh mục: Chip Trái Cây, Bánh Mochi, Bột Dinh Dưỡng

**Kết quả mong đợi:**
- ✅ Hiển thị 3 danh mục với ảnh nền đẹp
- ✅ Nhấn vào danh mục → Chuyển đến trang Products với filter tương ứng
- ✅ Hiệu ứng hover: Scale up, shadow tăng

### Test Case 2.5: Sản Phẩm Nổi Bật
**Các bước:**
1. Cuộn đến phần "Sản Phẩm Nổi Bật"
2. Quan sát các thẻ sản phẩm

**Kết quả mong đợi:**
- ✅ Hiển thị 8 sản phẩm nổi bật
- ✅ Mỗi thẻ có: Ảnh, tên, giá, badge danh mục
- ✅ Có 2 nút: "Thêm vào giỏ" và "Mua ngay"
- ✅ Sản phẩm trial có layout dọc (2+1 nút)
- ✅ Sản phẩm thường có layout ngang (2 nút cạnh nhau)

### Test Case 2.6: Footer
**Các bước:**
1. Cuộn xuống cuối trang

**Kết quả mong đợi:**
- ✅ Hiển thị thông tin công ty
- ✅ Link mạng xã hội: Facebook, Instagram, Twitter
- ✅ Copyright © 2024

---

## 3. TEST ĐĂNG KÝ TÀI KHOẢN

### 🎯 Mục tiêu: Kiểm tra chức năng đăng ký người dùng mới

### Test Case 3.1: Truy cập trang Đăng Ký
**Các bước:**
1. Nhấn vào icon Profile (góc phải header)
2. Chọn "Đăng Ký" hoặc truy cập: `http://localhost:3001/register`

**Kết quả mong đợi:**
- ✅ Trang đăng ký hiển thị với form gradient đẹp
- ✅ Có background gradient xanh-tím
- ✅ Form có các trường: Họ tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu

### Test Case 3.2: Đăng ký thành công
**Các bước:**
1. Nhập thông tin:
   - Họ tên: `Nguyễn Văn A`
   - Email: `nguyenvana@gmail.com`
   - Số điện thoại: `0912345678`
   - Mật khẩu: `123456`
   - Xác nhận mật khẩu: `123456`
2. Nhấn nút "Đăng Ký"

**Kết quả mong đợi:**
- ✅ Hiển thị thông báo thành công (màu xanh)
- ✅ Tự động chuyển đến trang Login sau 1 giây
- ✅ Dữ liệu lưu vào localStorage

### Test Case 3.3: Kiểm tra validation
**Các bước:**
1. Bỏ trống email, nhấn "Đăng Ký"
2. Nhập email không đúng định dạng: `abc123`
3. Nhập mật khẩu không khớp
4. Nhập số điện thoại không đúng: `abcdef`

**Kết quả mong đợi:**
- ✅ Hiển thị thông báo lỗi màu đỏ cho từng trường hợp
- ✅ Form không submit khi dữ liệu không hợp lệ

### Test Case 3.4: Đăng ký email đã tồn tại
**Các bước:**
1. Nhập email: `admin@sakefruit.com` (đã có sẵn)
2. Nhấn "Đăng Ký"

**Kết quả mong đợi:**
- ✅ Hiển thị lỗi: "Email đã được sử dụng"
- ✅ Không chuyển trang

---

## 4. TEST ĐĂNG NHẬP

### 🎯 Mục tiêu: Kiểm tra xác thực người dùng

### Test Case 4.1: Truy cập trang Đăng Nhập
**Các bước:**
1. Truy cập: `http://localhost:3001/login`

**Kết quả mong đợi:**
- ✅ Form đăng nhập hiển thị với gradient đẹp
- ✅ Có 2 trường: Email, Mật khẩu
- ✅ Có link "Chưa có tài khoản? Đăng ký ngay"

### Test Case 4.2: Đăng nhập với tài khoản Admin
**Các bước:**
1. Nhập:
   - Email: `admin@sakefruit.com`
   - Mật khẩu: `admin123`
2. Nhấn "Đăng Nhập"

**Kết quả mong đợi:**
- ✅ Hiển thị thông báo: "Đăng nhập thành công!"
- ✅ Chuyển về trang chủ (`/`)
- ✅ Icon Profile đổi thành avatar người dùng
- ✅ Thêm nút "Đăng Xuất" trong menu

### Test Case 4.3: Đăng nhập với tài khoản User
**Các bước:**
1. Nhập:
   - Email: `user01@gmail.com`
   - Mật khẩu: `user123`
2. Nhấn "Đăng Nhập"

**Kết quả mong đợi:**
- ✅ Đăng nhập thành công
- ✅ Chuyển về trang chủ
- ✅ Hiển thị tên user: "Trần Thị B"

### Test Case 4.4: Đăng nhập sai thông tin
**Các bước:**
1. Nhập:
   - Email: `test@test.com`
   - Mật khẩu: `wrongpass`
2. Nhấn "Đăng Nhập"

**Kết quả mong đợi:**
- ✅ Hiển thị lỗi: "Email hoặc mật khẩu không đúng"
- ✅ Không chuyển trang
- ✅ Form vẫn giữ email đã nhập

### Test Case 4.5: Đăng nhập với tài khoản vừa đăng ký
**Các bước:**
1. Sử dụng tài khoản đã đăng ký ở Test Case 3.2
   - Email: `nguyenvana@gmail.com`
   - Mật khẩu: `123456`
2. Nhấn "Đăng Nhập"

**Kết quả mong đợi:**
- ✅ Đăng nhập thành công
- ✅ Hiển thị tên: "Nguyễn Văn A"

---

## 5. TEST TRANG SẢN PHẨM

### 🎯 Mục tiêu: Kiểm tra hiển thị và lọc sản phẩm

### Test Case 5.1: Truy cập trang Sản Phẩm
**Các bước:**
1. Nhấn menu "Sản Phẩm" trên header
2. Hoặc truy cập: `http://localhost:3001/products`

**Kết quả mong đợi:**
- ✅ Hiển thị tất cả 13 sản phẩm
- ✅ Có breadcrumb: Trang Chủ > Sản Phẩm
- ✅ Có thanh tìm kiếm
- ✅ Có dropdown lọc theo danh mục

### Test Case 5.2: Lọc theo danh mục
**Các bước:**
1. Chọn dropdown "Tất cả danh mục"
2. Chọn "Chip Trái Cây"
3. Quan sát kết quả
4. Thử lại với "Bánh Mochi" và "Bột Dinh Dưỡng"

**Kết quả mong đợi:**
- ✅ Chỉ hiển thị sản phẩm của danh mục đã chọn
- ✅ Chip Trái Cây: 5 sản phẩm
- ✅ Bánh Mochi: 4 sản phẩm
- ✅ Bột Dinh Dưỡng: 4 sản phẩm

### Test Case 5.3: Tìm kiếm sản phẩm
**Các bước:**
1. Nhập từ khóa vào thanh tìm kiếm: `mochi`
2. Quan sát kết quả
3. Thử với: `chip`, `bột`, `dâu`, `chuối`

**Kết quả mong đợi:**
- ✅ Hiển thị sản phẩm có tên/mô tả chứa từ khóa
- ✅ Tìm kiếm không phân biệt hoa thường
- ✅ Cập nhật realtime khi gõ

### Test Case 5.4: Kết hợp lọc + tìm kiếm
**Các bước:**
1. Chọn danh mục: "Bánh Mochi"
2. Nhập tìm kiếm: `dâu`

**Kết quả mong đợi:**
- ✅ Chỉ hiển thị sản phẩm Mochi có chứa từ "dâu"
- ✅ Kết quả: "Bánh Mochi Dâu"

### Test Case 5.5: Test các nút trên Product Card
**Các bước:**
1. Tìm sản phẩm "Chip Chuối" (không trial)
2. Nhấn nút "Thêm vào giỏ"
3. Tìm sản phẩm "Trial Chip Dâu" (có trial)
4. Nhấn nút "Mua thử ngay"

**Kết quả mong đợi:**
- ✅ Nút "Thêm vào giỏ": Hiện popup thông báo xanh lá trong 2 giây
- ✅ Nút "Mua thử ngay": Chuyển đến trang Checkout
- ✅ Số lượng giỏ hàng tăng lên

---

## 6. TEST CHI TIẾT SẢN PHẨM

### 🎯 Mục tiêu: Kiểm tra trang xem thông tin chi tiết sản phẩm

### Test Case 6.1: Truy cập trang Chi Tiết
**Các bước:**
1. Vào trang Sản Phẩm
2. Nhấn vào bất kỳ thẻ sản phẩm nào
3. Hoặc truy cập: `http://localhost:3001/product/1`

**Kết quả mong đợi:**
- ✅ Chuyển đến trang chi tiết sản phẩm
- ✅ URL có dạng: `/product/:id`
- ✅ Breadcrumb: Trang Chủ > Sản Phẩm > Tên sản phẩm

### Test Case 6.2: Hiển thị thông tin sản phẩm
**Các bước:**
1. Quan sát layout trang

**Kết quả mong đợi:**
- ✅ Bên trái: Ảnh lớn + Gallery 4 ảnh nhỏ
- ✅ Bên phải: Tên, badge danh mục, giá, mô tả, đặc điểm
- ✅ Có nút điều chỉnh số lượng (+/-)
- ✅ Có 2 nút action: "Thêm vào giỏ" và "Mua ngay"

### Test Case 6.3: Gallery ảnh
**Các bước:**
1. Nhấn vào từng ảnh nhỏ trong gallery

**Kết quả mong đợi:**
- ✅ Ảnh lớn thay đổi khi nhấn vào ảnh nhỏ
- ✅ Ảnh đang chọn có border xanh lá
- ✅ Hiệu ứng mượt mà

### Test Case 6.4: Điều chỉnh số lượng
**Các bước:**
1. Nhấn nút "+" nhiều lần
2. Nhấn nút "-" nhiều lần
3. Thử nhập trực tiếp số lượng vào ô input

**Kết quả mong đợi:**
- ✅ Số lượng tăng/giảm đúng
- ✅ Không cho giảm xuống dưới 1
- ✅ Input số lượng có thể chỉnh sửa trực tiếp

### Test Case 6.5: Thêm vào giỏ hàng
**Các bước:**
1. Chọn số lượng: 3
2. Nhấn "Thêm vào giỏ"

**Kết quả mong đợi:**
- ✅ Popup thông báo xuất hiện: "Đã thêm vào giỏ hàng!"
- ✅ Popup màu xanh lá, gradient đẹp
- ✅ Popup tự động ẩn sau 2 giây
- ✅ Icon giỏ hàng trên header cập nhật số lượng
- ✅ Không chuyển trang

### Test Case 6.6: Mua ngay
**Các bước:**
1. Chọn số lượng: 2
2. Nhấn "Mua ngay"

**Kết quả mong đợi:**
- ✅ Sản phẩm được thêm vào giỏ hàng với số lượng đã chọn
- ✅ Tự động chuyển đến trang Checkout
- ✅ Trang Checkout hiển thị sản phẩm vừa chọn

### Test Case 6.7: Đặc điểm sản phẩm
**Các bước:**
1. Cuộn xuống phần "Đặc điểm nổi bật"

**Kết quả mong đợi:**
- ✅ Hiển thị list các đặc điểm với icon check màu xanh
- ✅ Font chữ rõ ràng, dễ đọc

---

## 7. TEST GIỎ HÀNG

### 🎯 Mục tiêu: Kiểm tra quản lý sản phẩm trong giỏ hàng

### Test Case 7.1: Truy cập trang Giỏ Hàng
**Các bước:**
1. Nhấn vào icon giỏ hàng trên header
2. Hoặc truy cập: `http://localhost:3001/cart`

**Kết quả mong đợi:**
- ✅ Hiển thị trang giỏ hàng với design hiện đại
- ✅ Background gradient nhẹ
- ✅ Card với border-radius tròn, shadow đẹp

### Test Case 7.2: Hiển thị danh sách sản phẩm
**Các bước:**
1. Quan sát các sản phẩm trong giỏ

**Kết quả mong đợi:**
- ✅ Mỗi item hiển thị: Ảnh, tên, giá, số lượng, tổng tiền
- ✅ Có nút điều chỉnh số lượng (+/-)
- ✅ Có nút xóa màu đỏ
- ✅ Hover vào item có hiệu ứng

### Test Case 7.3: Tăng/giảm số lượng
**Các bước:**
1. Nhấn nút "+" trên sản phẩm đầu tiên
2. Nhấn nhiều lần
3. Nhấn nút "-"
4. Thử nhập số lượng trực tiếp

**Kết quả mong đợi:**
- ✅ Số lượng thay đổi đúng
- ✅ Tổng tiền sản phẩm cập nhật
- ✅ Tổng đơn hàng cập nhật
- ✅ Không cho giảm xuống dưới 1

### Test Case 7.4: Xóa sản phẩm
**Các bước:**
1. Nhấn nút "Xóa" (màu đỏ) trên 1 sản phẩm
2. Xác nhận xóa

**Kết quả mong đợi:**
- ✅ Sản phẩm biến mất khỏi giỏ hàng
- ✅ Tổng đơn hàng cập nhật
- ✅ Số lượng trên icon giỏ hàng giảm

### Test Case 7.5: Xóa tất cả sản phẩm
**Các bước:**
1. Nhấn nút "Xóa Tất Cả" ở cuối danh sách
2. Xác nhận

**Kết quả mong đợi:**
- ✅ Tất cả sản phẩm bị xóa
- ✅ Hiển thị thông báo: "Giỏ hàng trống"
- ✅ Icon giỏ hàng rỗng (biểu tượng lớn màu xám)
- ✅ Có nút "Tiếp tục mua sắm"

### Test Case 7.6: Tóm tắt đơn hàng
**Các bước:**
1. Thêm vài sản phẩm vào giỏ
2. Quan sát cột "Tóm Tắt Đơn Hàng" bên phải

**Kết quả mong đợi:**
- ✅ Header màu xanh lá gradient
- ✅ Hiển thị: Tạm tính, Phí vận chuyển, Tổng cộng
- ✅ Tổng cộng in đậm, màu xanh lá, cỡ chữ lớn
- ✅ Có nút "Thanh Toán" gradient xanh

### Test Case 7.7: Tiến hành thanh toán
**Các bước:**
1. Nhấn nút "Thanh Toán" trong phần tóm tắt

**Kết quả mong đợi:**
- ✅ Chuyển đến trang Checkout
- ✅ Giỏ hàng vẫn giữ nguyên

---

## 8. TEST THANH TOÁN

### 🎯 Mục tiêu: Kiểm tra quy trình đặt hàng

### Test Case 8.1: Truy cập trang Thanh Toán
**Các bước:**
1. Có sản phẩm trong giỏ hàng
2. Truy cập: `http://localhost:3001/checkout`

**Kết quả mong đợi:**
- ✅ Hiển thị trang checkout với design hiện đại
- ✅ Card với border-radius tròn, shadow
- ✅ Form bên trái, Order Summary bên phải

### Test Case 8.2: Form thông tin giao hàng
**Các bước:**
1. Quan sát form

**Kết quả mong đợi:**
- ✅ Header gradient xanh lá: "Thông Tin Giao Hàng"
- ✅ Các trường: Họ tên, Email, SĐT, Địa chỉ, Thành phố, Quận/Huyện, Phường/Xã
- ✅ Trường ghi chú (optional)
- ✅ Input có border 2px, border-radius 8px
- ✅ Focus vào input có glow màu xanh

### Test Case 8.3: Chọn phương thức thanh toán
**Các bước:**
1. Quan sát phần "Phương Thức Thanh Toán"
2. Nhấn vào từng option

**Kết quả mong đợi:**
- ✅ Hiển thị 2 card: "Thanh Toán Khi Nhận Hàng (COD)" và "Chuyển Khoản Ngân Hàng"
- ✅ Mỗi card có icon đẹp
- ✅ Card được chọn có border xanh lá
- ✅ Hover vào card có hiệu ứng scale

### Test Case 8.4: Order Summary
**Các bước:**
1. Quan sát cột bên phải

**Kết quả mong đợi:**
- ✅ Header gradient: "Đơn Hàng Của Bạn"
- ✅ Hiển thị list sản phẩm với ảnh, tên, số lượng, giá
- ✅ Border trên cùng màu xanh lá 3px
- ✅ Tổng tiền in đậm, màu xanh lá

### Test Case 8.5: Đặt hàng thành công
**Các bước:**
1. Điền đầy đủ thông tin:
   - Họ tên: `Nguyễn Văn Test`
   - Email: `test@gmail.com`
   - SĐT: `0909123456`
   - Địa chỉ: `123 Đường ABC`
   - Thành phố: `TP.HCM`
   - Quận: `Quận 1`
   - Phường: `Phường Bến Nghé`
2. Chọn phương thức: COD
3. Nhấn "Đặt Hàng"

**Kết quả mong đợi:**
- ✅ Hiển thị alert: "Đặt hàng thành công!"
- ✅ Giỏ hàng bị xóa sạch
- ✅ Chuyển về trang chủ
- ✅ Icon giỏ hàng = 0

### Test Case 8.6: Validation form
**Các bước:**
1. Bỏ trống một số trường
2. Nhấn "Đặt Hàng"

**Kết quả mong đợi:**
- ✅ Browser hiển thị thông báo: "Vui lòng điền vào trường này"
- ✅ Focus vào trường đầu tiên bị lỗi
- ✅ Không submit form

### Test Case 8.7: Giỏ hàng trống
**Các bước:**
1. Xóa hết sản phẩm trong giỏ
2. Truy cập: `http://localhost:3001/checkout`

**Kết quả mong đợi:**
- ✅ Hiển thị thông báo: "Giỏ hàng trống"
- ✅ Icon giỏ hàng lớn màu xám
- ✅ Có nút "Quay Lại Mua Sắm"

---

## 9. TEST TRANG PROFILE

### 🎯 Mục tiêu: Kiểm tra quản lý thông tin cá nhân

### Test Case 9.1: Truy cập Profile (Chưa đăng nhập)
**Các bước:**
1. Đăng xuất (nếu đang đăng nhập)
2. Truy cập: `http://localhost:3001/profile`

**Kết quả mong đợi:**
- ✅ Tự động chuyển đến trang Login
- ✅ Hiển thị thông báo: "Vui lòng đăng nhập"

### Test Case 9.2: Truy cập Profile (Đã đăng nhập)
**Các bước:**
1. Đăng nhập với: `admin@sakefruit.com` / `admin123`
2. Nhấn vào icon Profile → chọn "Profile"

**Kết quả mong đợi:**
- ✅ Hiển thị trang Profile với design gradient đẹp
- ✅ Hero section gradient xanh-tím
- ✅ Tiêu đề: "Thông Tin Cá Nhân"

### Test Case 9.3: Thông tin cơ bản
**Các bước:**
1. Quan sát phần thông tin

**Kết quả mong đợi:**
- ✅ Card avatar lớn ở giữa với icon user
- ✅ Hiển thị: Tên, Email, SĐT
- ✅ Badge "Admin" (nếu là admin)
- ✅ Card có shadow, hover scale up

### Test Case 9.4: Thống kê
**Các bước:**
1. Cuộn xuống phần stats

**Kết quả mong đợi:**
- ✅ Hiển thị 3 card: Đơn Hàng, Sản Phẩm Yêu Thích, Điểm Tích Lũy
- ✅ Số liệu: 5 đơn, 12 yêu thích, 850 điểm
- ✅ Icon đẹp, màu gradient
- ✅ Hover có hiệu ứng

### Test Case 9.5: Các nút hành động
**Các bước:**
1. Quan sát các nút
2. Nhấn từng nút

**Kết quả mong đợi:**
- ✅ Có 3 nút: Chỉnh Sửa Profile, Lịch Sử Đơn Hàng, Đăng Xuất
- ✅ Nút gradient đẹp với icon
- ✅ Hover có hiệu ứng shadow
- ✅ Nhấn "Đăng Xuất" → Logout và về trang chủ

### Test Case 9.6: Chỉnh sửa Profile
**Các bước:**
1. Nhấn nút "Chỉnh Sửa Profile"
2. Modal xuất hiện
3. Thay đổi thông tin:
   - Tên: `Admin Updated`
   - SĐT: `0987654321`
4. Nhấn "Lưu Thay Đổi"

**Kết quả mong đợi:**
- ✅ Modal hiển thị với form
- ✅ Các trường có giá trị hiện tại
- ✅ Sau khi lưu: Thông báo thành công
- ✅ Thông tin cập nhật trên trang
- ✅ Dữ liệu lưu vào localStorage

---

## 10. TEST CÁC TÍNH NĂNG KHÁC

### Test Case 10.1: Responsive Design
**Các bước:**
1. Nhấn F12 mở DevTools
2. Chuyển sang chế độ mobile (Ctrl + Shift + M)
3. Thử các kích thước: iPhone, iPad, Desktop

**Kết quả mong đợi:**
- ✅ Layout tự động điều chỉnh theo màn hình
- ✅ Mobile: Menu collapse, card xếp dọc
- ✅ Tablet: 2 cột sản phẩm
- ✅ Desktop: 4 cột sản phẩm

### Test Case 10.2: LocalStorage Persistence
**Các bước:**
1. Thêm sản phẩm vào giỏ
2. Đăng nhập
3. F5 refresh trang
4. Kiểm tra giỏ hàng và trạng thái đăng nhập

**Kết quả mong đợi:**
- ✅ Giỏ hàng vẫn giữ nguyên sau refresh
- ✅ Trạng thái đăng nhập không mất
- ✅ Thông tin user vẫn còn

### Test Case 10.3: Navigation
**Các bước:**
1. Test tất cả link trong menu
2. Test nút Back trên trình duyệt
3. Test breadcrumb links

**Kết quả mong đợi:**
- ✅ Tất cả link hoạt động
- ✅ Back button hoạt động đúng
- ✅ Breadcrumb có thể click và điều hướng

### Test Case 10.4: Notification System
**Các bước:**
1. Thêm sản phẩm vào giỏ từ nhiều nơi:
   - Trang chủ
   - Trang Products
   - Trang ProductDetail
2. Quan sát popup

**Kết quả mong đợi:**
- ✅ Popup xuất hiện ở đúng vị trí (giữa card)
- ✅ Animation popIn mượt mà
- ✅ Tự động ẩn sau 2 giây
- ✅ Background gradient xanh lá đẹp

### Test Case 10.5: Search & Filter Performance
**Các bước:**
1. Vào trang Products
2. Gõ nhanh trong search box
3. Thay đổi filter nhiều lần

**Kết quả mong đợi:**
- ✅ Kết quả cập nhật realtime
- ✅ Không bị lag
- ✅ Kết hợp search + filter hoạt động tốt

---

## 📊 CHECKLIST TỔNG HỢP

### ✅ Authentication & User
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập (admin & user)
- [ ] Đăng xuất
- [ ] Xem profile
- [ ] Chỉnh sửa profile
- [ ] Validation form

### ✅ Products
- [ ] Hiển thị danh sách sản phẩm
- [ ] Lọc theo danh mục
- [ ] Tìm kiếm sản phẩm
- [ ] Xem chi tiết sản phẩm
- [ ] Gallery ảnh
- [ ] Điều chỉnh số lượng

### ✅ Shopping Cart
- [ ] Thêm vào giỏ hàng (+ notification)
- [ ] Xem giỏ hàng
- [ ] Tăng/giảm số lượng
- [ ] Xóa sản phẩm
- [ ] Xóa tất cả
- [ ] Tính tổng tiền

### ✅ Checkout
- [ ] Form thông tin giao hàng
- [ ] Chọn phương thức thanh toán
- [ ] Order summary
- [ ] Đặt hàng thành công
- [ ] Validation form

### ✅ UI/UX
- [ ] Hero section gradient
- [ ] Product cards đẹp
- [ ] Button gradients
- [ ] Hover effects
- [ ] Animations
- [ ] Responsive design

### ✅ Technical
- [ ] Routing hoạt động
- [ ] LocalStorage persistence
- [ ] Browser back/forward
- [ ] No console errors
- [ ] Fast loading

---

## 🚀 TÀI KHOẢN TEST MẶC ĐỊNH

### Admin Account
```
Email: admin@sakefruit.com
Password: admin123
```

### User Account
```
Email: user01@gmail.com
Password: user123
```

---

## 🐛 GHI CHÚ KHI TEST

### Nếu gặp lỗi:
1. Kiểm tra Terminal có lỗi màu đỏ không
2. Thử refresh trang (F5)
3. Xóa cache trình duyệt (Ctrl + Shift + Delete)
4. Kiểm tra localStorage (F12 → Application → Local Storage)
5. Restart dev server (Ctrl + C → npm run dev)

### Tips:
- Mở DevTools (F12) để xem console logs
- Kiểm tra Network tab nếu có vấn đề tải dữ liệu
- Test trên nhiều trình duyệt: Chrome, Edge, Firefox
- Test trên cả mobile và desktop

---

## ✨ HOÀN THÀNH

Bạn đã test xong tất cả chức năng! 🎉

Nếu tất cả test case đều PASS ✅, website đã sẵn sàng demo!
