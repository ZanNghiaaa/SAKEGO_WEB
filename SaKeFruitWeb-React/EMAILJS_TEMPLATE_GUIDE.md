# Hướng dẫn tạo Email Template trên EmailJS

## Bước 1: Tạo Template

1. Vào: https://dashboard.emailjs.com/admin/templates
2. Click **"Create New Template"**

## Bước 2: Cấu hình Template

### Template Settings (Tab Settings):
- **To Email**: `vannghia.170320@gmail.com`
- **From Name**: `Sa Ke Fruit Website`
- **Reply To**: `{{from_email}}`
- **BCC**: (để trống)

### Subject:
```
[Sa Ke Fruit] Tin nhắn mới từ {{from_name}}
```

### Content (Body):
```
Xin chào,

Bạn nhận được tin nhắn mới từ website Sa Ke Fruit:

━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 THÔNG TIN LIÊN HỆ
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Họ và tên: {{from_name}}
📧 Email: {{from_email}}
📱 Số điện thoại: {{from_phone}}
🏷️ Chủ đề: {{subject}}

💬 Nội dung tin nhắn:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Vui lòng phản hồi khách hàng trong vòng 24 giờ.

Trân trọng,
Sa Ke Fruit
```

## Bước 3: Test Template

Click **"Test It"** để test template với dữ liệu mẫu

## Bước 4: Save và lấy Template ID

1. Click **"Save"**
2. Copy **Template ID** (ví dụ: `template_abc123`)
3. Cập nhật vào code Contact.jsx

## Các biến cần có trong Template:

✅ `{{from_name}}` - Tên người gửi
✅ `{{from_email}}` - Email người gửi
✅ `{{from_phone}}` - Số điện thoại
✅ `{{subject}}` - Chủ đề
✅ `{{message}}` - Nội dung tin nhắn

## Lưu ý:

⚠️ Tên biến phải viết đúng chính xác (case-sensitive)
⚠️ Template phải được SAVE trước khi sử dụng
⚠️ Service phải được kết nối với Gmail account
