# 📧 Hướng Dẫn Cấu Hình Email Gửi Thông Báo Đơn Hàng

## Tính năng
Khi khách hàng đặt hàng thành công, hệ thống sẽ tự động gửi email xác nhận đến địa chỉ email của khách hàng với đầy đủ thông tin:
- Mã đơn hàng
- Chi tiết sản phẩm
- Tổng tiền
- Địa chỉ giao hàng
- Thời gian dự kiến giao hàng

## Bước 1: Tạo App Password cho Gmail

### Yêu cầu:
- Tài khoản Gmail
- Bật xác thực 2 bước (2FA)

### Các bước:

1. **Truy cập Google Account**: https://myaccount.google.com/
2. **Chọn "Security"** (Bảo mật) ở menu bên trái
3. **Bật "2-Step Verification"** (Xác minh 2 bước) nếu chưa bật
4. **Tạo App Password**:
   - Truy cập: https://myaccount.google.com/apppasswords
   - Hoặc tìm "App passwords" trong phần Security
   - Chọn app: **Mail**
   - Chọn device: **Other** (nhập tên: "SaKeFruit Backend")
   - Click **Generate**
   - Copy mã 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

## Bước 2: Cấu Hình File .env

Mở file `.env` trong thư mục `SaKeFruitWeb-Backend` và cập nhật:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com          # Email Gmail của bạn
EMAIL_PASS=xxxx xxxx xxxx xxxx           # App Password vừa tạo (giữ nguyên khoảng trắng hoặc xóa hết)
```

### Ví dụ:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sakefruit.store@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## Bước 3: Restart Backend Server

Sau khi cấu hình xong, restart lại backend server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
cd SaKeFruitWeb-Backend
npm start
# hoặc
npm run dev
```

## Bước 4: Test Gửi Email

1. Truy cập website frontend
2. Thêm sản phẩm vào giỏ hàng
3. Thực hiện đặt hàng với email thật của bạn
4. Kiểm tra hộp thư đến (Inbox) hoặc Spam để xem email xác nhận

## 📝 Lưu Ý Quan Trọng

### ✅ Những điều cần làm:
- **Bật 2FA** trên Gmail trước khi tạo App Password
- **Không chia sẻ** App Password với người khác
- Sử dụng **email thật** khi đặt hàng để test
- Kiểm tra cả **thư mục Spam** nếu không thấy email

### ❌ Những lỗi thường gặp:

#### 1. "Invalid login" hoặc "Username and Password not accepted"
**Nguyên nhân**: Chưa bật 2FA hoặc dùng mật khẩu Gmail thay vì App Password
**Giải pháp**: Tạo App Password mới theo hướng dẫn trên

#### 2. Email không gửi được
**Kiểm tra**:
- File `.env` có đúng thông tin không?
- Backend server có restart sau khi sửa `.env`?
- Gmail có bị khóa tạm thời do gửi quá nhiều email?

#### 3. Email vào Spam
**Giải pháp**: 
- Đánh dấu "Not Spam" trong Gmail
- Thêm địa chỉ email gửi vào Contact

## 🔒 Bảo Mật

### ⚠️ CẢNH BÁO:
- **KHÔNG commit file `.env`** lên Git/GitHub
- **KHÔNG chia sẻ** App Password
- Đã có `.gitignore` để bảo vệ file `.env`
- Nếu lỡ lộ App Password, hãy **revoke** ngay tại: https://myaccount.google.com/apppasswords

## 🎨 Tùy Chỉnh Email Template

Để thay đổi nội dung email, chỉnh sửa file:
```
SaKeFruitWeb-Backend/src/utils/email.js
```

Function `orderConfirmationEmail()` chứa HTML template của email.

## 📧 Các Loại Email Khác (Tương Lai)

Có thể mở rộng thêm các email khác:
- ✉️ Email khi đơn hàng được xác nhận
- ✉️ Email khi đơn hàng đang giao
- ✉️ Email khi giao hàng thành công
- ✉️ Email nhắc nhở đơn hàng chưa thanh toán

## 🆘 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Console/Terminal có lỗi gì không?
2. File `.env` đã lưu và restart server chưa?
3. Email trong console log có hiển thị "Email sent successfully" không?

## ✨ Hoàn Tất!

Sau khi cấu hình xong, hệ thống sẽ tự động gửi email xác nhận cho mọi đơn hàng thành công! 🎉

---
**Version**: 1.0.0  
**Last Updated**: March 10, 2026
