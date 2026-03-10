# 🏦 Hướng Dẫn Cấu Hình Thông Tin Ngân Hàng BIDV

## 📍 Vị trí file cần chỉnh sửa
**File:** `src/pages/Checkout.jsx`  
**Dòng:** ~25-32

## ✏️ Cách thay đổi thông tin tài khoản

Tìm đoạn code sau trong file `Checkout.jsx`:

```javascript
// Thông tin tài khoản ngân hàng của bạn - BẠN CÓ THỂ THAY ĐỔI Ở ĐÂY
const bankAccountInfo = {
  bankId: 'bidv',                     // Mã ngân hàng BIDV
  bankName: 'BIDV',                   // Tên ngắn gọn
  bankFullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', // Tên đầy đủ
  accountNumber: '6930278729',        // Thay bằng số tài khoản thật của bạn
  accountName: 'NGUYEN VAN NGHIA',    // Thay bằng tên chủ tài khoản (VIẾT HOA, KHÔNG DẤU)
  prefix: 'SAOKE'                     // Mã đơn hàng prefix
};
```

**🎯 Hiện tại:** Website chỉ hỗ trợ thanh toán qua **BIDV** (không có dropdown chọn ngân hàng)

## 🔧 Các bước cấu hình:

### 1. **bankId** (Mã ngân hàng)
- Mặc định: `'bidv'`
- **Nếu muốn đổi sang ngân hàng khác:**
  - `'vcb'` - Vietcombank
  - `'vib'` - VIB
  - `'tcb'` - Techcombank
  - `'mb'` - MB Bank
  - `'acb'` - ACB
  - Xem danh sách đầy đủ: https://api.vietqr.io/v2/banks

### 2. **bankName** (Tên ngắn)
- Thay `'BIDV'` thành tên viết tắt ngân hàng của bạn
- Ví dụ: `'VCB'`, `'VIB'`, `'TCB'`

### 3. **bankFullName** (Tên đầy đủ)
- Tên chính thức của ngân hàng
- Hiển thị dưới tên ngắn trong badge

### 4. **accountNumber** (Số tài khoản)
- Thay `'6930278729'` bằng số tài khoản thật của bạn
- Ví dụ: `'19038339888'` hoặc `'1234567890'`
- **Lưu ý:** Để trong dấu nháy đơn `' '`

### 5. **accountName** (Tên chủ tài khoản)
- Thay `'NGUYEN VAN NGHIA'` bằng tên chủ tài khoản của bạn
- **QUAN TRỌNG:** 
  - Phải VIẾT HOA toàn bộ
  - KHÔNG DẤU (ví dụ: Ô → O, Ê → E, Á → A)
  - Ví dụ đúng: `'NGUYEN VAN A'`, `'CONG TY TNHH ABC'`
  - Ví dụ sai: ❌ `'Nguyễn Văn A'`, ❌ `'nguyen van a'`

### 6. **prefix** (Mã tiền tố đơn hàng)
- Thay `'SAOKE'` bằng mã bạn muốn
- Nội dung chuyển khoản sẽ là: `[PREFIX] [SỐ ĐIỆN THOẠI] [TÊN KHÁCH]`
- Ví dụ với prefix `'DH'`: Nội dung sẽ là `DH 0909123456 Nguyen Van A`

## 📝 Ví dụ cấu hình thực tế:

### Ví dụ 1: Tài khoản BIDV (Hiện tại)
```javascript
const bankAccountInfo = {
  bankId: 'bidv',
  bankName: 'BIDV',
  bankFullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
  accountNumber: '6930278729',
  accountName: 'NGUYEN VAN NGHIA',
  prefix: 'SAOKE'
};
```

### Ví dụ 2: Tài khoản Vietcombank
```javascript
const bankAccountInfo = {
  bankId: 'vcb',
  bankName: 'Vietcombank',
  bankFullName: 'Ngân hàng TMCP Ngoại thương Việt Nam',
  accountNumber: '0123456789',
  accountName: 'CONG TY TNHH TRAI CAY SA O KE',
  prefix: 'DONHANG'
};
```

### Ví dụ 3: Tài khoản VIB
```javascript
const bankAccountInfo = {
  bankId: 'vib',
  bankName: 'VIB',
  bankFullName: 'Ngân hàng TMCP Quốc tế Việt Nam',
  accountNumber: '9876543210',
  accountName: 'HO KINH DOANH TRAN THI MAI',
  prefix: 'DH'
};
```

## 🎯 Nội dung chuyển khoản sẽ được tạo tự động:

Sau khi khách hàng điền form, nội dung chuyển khoản sẽ là:
```
[PREFIX] [SỐ ĐIỆN THOẠI] [TÊN KHÁCH HÀNG]
```

Ví dụ:
- Prefix: `SAOKE`
- Số điện thoại khách: `0909123456`
- Tên khách: `Nguyen Van A`
- **Kết quả:** `SAOKE 0909123456 Nguyen Van A`

## ✅ Sau khi chỉnh sửa:

1. **Lưu file** (Ctrl + S)
2. **Server tự động reload** (nếu đang chạy `npm run dev`)
3. **Test ngay:**
   - Vào trang Checkout
   - Chọn "Chuyển khoản ngân hàng"
   - Chọn ngân hàng
   - **Mã QR sẽ hiển thị với thông tin TÀI KHOẢN THẬT của bạn!**

## 🔍 Kiểm tra mã QR:

Sau khi cấu hình, mã QR sẽ chứa:
- ✅ Mã ngân hàng (VCB, VIB, TCB...)
- ✅ Số tài khoản CỦA BẠN
- ✅ Tên chủ tài khoản CỦA BẠN
- ✅ Số tiền (tự động từ giỏ hàng)
- ✅ Nội dung chuyển khoản (PREFIX + SĐT + Tên khách)

## 📱 Test với app ngân hàng:

1. Mở app ngân hàng trên điện thoại
2. Chọn chức năng "Quét QR" hoặc "Chuyển khoản QR"
3. Quét mã QR trên màn hình
4. **App sẽ tự động điền đầy đủ thông tin:**
   - Ngân hàng nhận
   - Số tài khoản nhận
   - Tên người nhận
   - Số tiền
   - Nội dung chuyển khoản

## ⚠️ Lưu ý quan trọng:

1. **Tên chủ tài khoản phải ĐÚNG với tên trên tài khoản ngân hàng**
2. **Viết HOA, KHÔNG DẤU** (VietQR yêu cầu)
3. **Số tài khoản KHÔNG có khoảng trắng**
4. **Sau khi sửa, nhớ lưu file và test lại**

## 🎉 Kết quả:

Khi khách hàng quét mã QR:
- Không cần nhập thủ công
- Tất cả thông tin tự động điền
- Chỉ cần xác nhận và thanh toán
- Chuyên nghiệp và tiện lợi!

---

**Chúc bạn demo thành công! 🚀**
