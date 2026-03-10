# Hướng Dẫn Cấu Hình EmailJS

## Bước 1: Đăng ký tài khoản EmailJS

1. Truy cập: https://www.emailjs.com/
2. Nhấn **Sign Up** để tạo tài khoản miễn phí
3. Xác nhận email

## Bước 2: Tạo Email Service

1. Đăng nhập vào EmailJS Dashboard
2. Chọn **Email Services** > **Add New Service**
3. Chọn **Gmail** (hoặc email provider bạn muốn)
4. Kết nối với Gmail account của bạn
5. Copy **Service ID** (ví dụ: `service_sakefruit`)

## Bước 3: Tạo Email Template

1. Chọn **Email Templates** > **Create New Template**
2. Đặt tên: `Contact Form - Sa Ke Fruit`
3. **Template ID**: `template_contact`
4. **Email Template Content**:

```
Subject: [Sa Ke Fruit] Tin nhắn mới từ {{from_name}}

Content:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 TIN NHẮN MỚI TỪ WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Họ tên: {{from_name}}
📧 Email: {{from_email}}
📱 Điện thoại: {{from_phone}}
🏷️ Chủ đề: {{subject}}

💬 Nội dung:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gửi từ: Sa Ke Fruit Website
Thời gian: {{sent_time}}
```

5. **Settings**:
   - To Email: `{{to_email}}` hoặc email cố định của bạn
   - From Name: `{{from_name}}`
   - Reply To: `{{from_email}}`

6. **Save Template**

## Bước 4: Lấy Public Key

1. Vào **Account** > **General**
2. Copy **Public Key** (dạng: `YOUR_PUBLIC_KEY_HERE`)

## Bước 5: Cập nhật code

Mở file `src/pages/Contact.jsx` và thay thế:

```javascript
// Thay đổi các giá trị này:
const serviceID = 'service_sakefruit'; // Service ID từ bước 2
const templateID = 'template_contact'; // Template ID từ bước 3
const publicKey = 'YOUR_PUBLIC_KEY_HERE'; // Public Key từ bước 4
```

## Bước 6: Test

1. Chạy website: `npm run dev`
2. Vào trang **Liên hệ**
3. Điền form và nhấn **Gửi tin nhắn**
4. Kiểm tra email inbox

## Email Template Variables

Các biến có sẵn:
- `{{from_name}}` - Tên người gửi
- `{{from_email}}` - Email người gửi
- `{{from_phone}}` - SĐT người gửi
- `{{subject}}` - Chủ đề
- `{{message}}` - Nội dung tin nhắn
- `{{to_email}}` - Email nhận (đã set trong code)

## Giới hạn Free Plan

- **200 emails/tháng** (miễn phí)
- Nếu cần nhiều hơn, nâng cấp lên plan trả phí

## Troubleshooting

### Lỗi: "Failed to send email"
- Kiểm tra Service ID, Template ID, Public Key
- Kiểm tra kết nối internet
- Xem console.log để biết lỗi cụ thể

### Email không nhận được
- Kiểm tra spam/junk folder
- Verify email service đã được kết nối đúng
- Kiểm tra template settings (To Email)

## Bảo mật

⚠️ **LƯU Ý**: Public Key có thể công khai (frontend), nhưng không share Service ID và Template ID ra ngoài để tránh spam.

## Support

- EmailJS Docs: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/contact/
