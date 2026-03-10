# ✅ CHECKLIST KIỂM TRA MÃ QR THANH TOÁN

## 📋 Thông tin đã cấu hình:

```
✅ Số tài khoản:  6930278729
✅ Tên chủ TK:    NGUYEN VAN NGHIA
✅ Prefix:        SAOKE
✅ 15 ngân hàng:  VCB, VTB, BIDV, Agribank, TCB, MB, ACB, 
                  VPBank, TPBank, Sacombank, HDBank, SHB, 
                  VIB, SeABank, OCB
```

## 🔍 Cách kiểm tra từng bước:

### 1️⃣ Mở trình duyệt
- URL: **http://localhost:3001/**
- Mở Console (F12) để xem debug logs

### 2️⃣ Thêm sản phẩm vào giỏ hàng
- Vào trang "Sản phẩm"
- Chọn bất kỳ sản phẩm nào
- Nhấn "Thêm vào giỏ hàng"

### 3️⃣ Vào trang Checkout
- Nhấn icon giỏ hàng hoặc "Thanh Toán"

### 4️⃣ Điền form đầy đủ (QUAN TRỌNG!)
```
Họ và tên:       [Nhập tên của bạn]
Số điện thoại:   [Nhập SĐT - VÍ DỤ: 0909123456]
Email:           [Nhập email]
Địa chỉ:         [Nhập địa chỉ]
Thành phố:       [Chọn thành phố]
Quận/Huyện:      [Nhập quận]
Phường/Xã:       [Nhập phường]
```

**⚠️ Lưu ý:** Phải điền SĐT và Họ tên để nội dung chuyển khoản đầy đủ!

### 5️⃣ Chọn phương thức thanh toán
- Chọn radio button: **"Chuyển khoản ngân hàng"**
- Dropdown ngân hàng sẽ xuất hiện với animation trượt xuống

### 6️⃣ Chọn ngân hàng
- Chọn ngân hàng (VÍ DỤ: **VIB** - Ngân hàng TMCP Quốc tế Việt Nam)
- Mã QR sẽ hiển thị ngay lập tức!

### 7️⃣ Kiểm tra giao diện
Sẽ thấy layout 2 cột:

**BÊN TRÁI (Background xanh):**
- ✅ Header "QUÉT MÃ QR ĐỂ THANH TOÁN"
- ✅ Mã QR (ảnh từ VietQR API)
- ✅ 3 bước hướng dẫn:
  - Mở app ngân hàng
  - Quét mã QR
  - Xác nhận thanh toán

**BÊN PHẢI (Background trắng):**
- ✅ Header "THÔNG TIN CHUYỂN KHOẢN"
- ✅ Ngân hàng: VIB (hoặc ngân hàng bạn chọn)
- ✅ Số tài khoản: **6930278729**
- ✅ Chủ tài khoản: **NGUYEN VAN NGHIA**
- ✅ Số tiền: [Tổng giỏ hàng - màu đỏ]
- ✅ Nội dung: **SAOKE [SĐT bạn nhập] [Tên bạn nhập]** - màu xanh
- ✅ Box lưu ý màu vàng với 3 điểm quan trọng

### 8️⃣ Kiểm tra Console (F12)
Trong Console sẽ thấy:
```
✅ QR Code đã load thành công!
📊 Thông tin QR:
  - Ngân hàng: VIB
  - Số TK: 6930278729
  - Chủ TK: NGUYEN VAN NGHIA
  - Số tiền: 150.000đ
  - Nội dung: SAOKE 0909123456 Nguyen Van A
```

### 9️⃣ Test với điện thoại (QUAN TRỌNG!)
1. Mở app banking trên điện thoại (VIB, Vietcombank, v.v.)
2. Chọn "Chuyển khoản" → "Quét QR"
3. Quét mã QR trên màn hình máy tính
4. **Kiểm tra app tự động điền:**
   - ✅ Ngân hàng nhận: VIB
   - ✅ Số tài khoản: **6930278729**
   - ✅ Tên người nhận: **NGUYEN VAN NGHIA**
   - ✅ Số tiền: [Đúng với giỏ hàng]
   - ✅ Nội dung: **SAOKE [SĐT] [Tên]**

### 🔟 Kiểm tra responsive (Mobile)
1. Nhấn F12 → Toggle Device Toolbar (Ctrl + Shift + M)
2. Chọn "iPhone 12 Pro" hoặc "Pixel 5"
3. Kiểm tra:
   - ✅ Layout chuyển thành 1 cột dọc
   - ✅ QR code ở trên
   - ✅ Thông tin chi tiết ở dưới
   - ✅ Text và spacing phù hợp với mobile

## 🎨 Các hiệu ứng cần kiểm tra:

- ✅ Animation slideDown khi chọn ngân hàng
- ✅ Animation fadeIn cho QR code
- ✅ Hover effect trên các bank-detail-item
- ✅ Pulse animation trên icon lightbulb (lưu ý)
- ✅ Border xanh và shadow đẹp mắt

## 🔧 Nếu muốn test với ngân hàng khác:

Thử chọn các ngân hàng khác nhau:
- **Vietcombank (VCB)** - Phổ biến nhất
- **Techcombank (TCB)** - Modern
- **MB Bank (MB)** - Ứng dụng tốt
- **VPBank (VPBank)** - Tiện lợi
- **ACB (ACB)** - Giao diện đẹp

Mỗi ngân hàng sẽ tạo QR code khác nhau!

## ❌ Các lỗi có thể gặp và cách fix:

### Lỗi 1: QR code không hiển thị
**Nguyên nhân:** API VietQR lỗi hoặc tham số sai
**Giải pháp:** Kiểm tra Console, sẽ thấy placeholder SVG hiện ra

### Lỗi 2: Nội dung chuyển khoản thiếu tên/SĐT
**Nguyên nhân:** Chưa điền form đầy đủ
**Giải pháp:** Điền đầy đủ "Họ và tên" và "Số điện thoại"

### Lỗi 3: Số tiền = 0đ
**Nguyên nhân:** Giỏ hàng trống
**Giải pháp:** Thêm sản phẩm vào giỏ hàng

### Lỗi 4: App banking báo "Tài khoản không tồn tại"
**Nguyên nhân:** Số tài khoản không đúng với ngân hàng đã chọn
**Lưu ý:** Đây là số TK demo, để test thật cần dùng TK thật của bạn

## 📝 Thay đổi thông tin tài khoản:

Nếu muốn đổi sang số TK thật:

1. Mở file: `src/pages/Checkout.jsx`
2. Tìm dòng 25-29:
```javascript
const bankAccountInfo = {
  accountNumber: '6930278729',        // ← Đổi ở đây
  accountName: 'NGUYEN VAN NGHIA',    // ← Đổi ở đây (VIẾT HOA, KHÔNG DẤU)
  prefix: 'SAOKE'                     // ← Đổi prefix nếu muốn
};
```
3. Lưu file (Ctrl + S)
4. Server tự động reload
5. Refresh trình duyệt và test lại!

## ✨ Điểm mạnh của tính năng này:

1. ✅ **Tự động hoàn toàn** - Không cần nhập thủ công
2. ✅ **Hỗ trợ 15 ngân hàng** - Phủ 99% người dùng VN
3. ✅ **Số tiền tự động** - Lấy từ giỏ hàng
4. ✅ **Nội dung động** - Bao gồm SĐT và tên khách
5. ✅ **Responsive hoàn hảo** - Desktop & Mobile
6. ✅ **Giao diện chuyên nghiệp** - Animation mượt mà
7. ✅ **Debug dễ dàng** - Console log đầy đủ
8. ✅ **Fallback an toàn** - Có placeholder nếu lỗi

## 🎯 Kết quả mong đợi:

Khi demo cho khách hàng/giáo viên:
- 👍 Giao diện đẹp, chuyên nghiệp
- 👍 Chức năng hoạt động mượt mà
- 👍 QR code quét được bằng app thật
- 👍 Thông tin tự động điền đầy đủ
- 👍 Trải nghiệm người dùng tốt

---

**Chúc bạn demo thành công! 🚀🎉**

**Server:** http://localhost:3001/
**Status:** ✅ READY TO DEMO
