# ✅ KIỂM TRA THÔNG TIN TÀI KHOẢN NGÂN HÀNG

## 📍 Thông tin hiện tại của bạn:

```javascript
✅ Số tài khoản: 6930278729
✅ Tên chủ TK:   NGUYEN VAN NGHIA
✅ Prefix:       SAOKE
```

## 🎯 Cách kiểm tra:

### Bước 1: Vào trang Checkout
1. Thêm sản phẩm vào giỏ hàng
2. Nhấn "Thanh Toán"

### Bước 2: Điền form thông tin
- **Họ và tên:** Nhập tên của bạn (ví dụ: Nguyễn Văn A)
- **Số điện thoại:** Nhập SĐT (ví dụ: 0909123456)
- **Email:** Nhập email
- **Địa chỉ, Thành phố, Quận/Huyện, Phường/Xã:** Điền đầy đủ

### Bước 3: Chọn thanh toán ngân hàng
1. Chọn radio button "Chuyển khoản ngân hàng"
2. Dropdown ngân hàng sẽ xuất hiện
3. Chọn ngân hàng của bạn (ví dụ: VIB)

### Bước 4: Kiểm tra mã QR và thông tin
Sau khi chọn ngân hàng, sẽ hiển thị:

**Bên trái - Mã QR:**
- Mã QR để quét thanh toán
- 3 bước hướng dẫn

**Bên phải - Thông tin chi tiết:**
```
Ngân hàng:     [Tên ngân hàng bạn chọn]
Số tài khoản:  6930278729
Chủ tài khoản: NGUYEN VAN NGHIA
Số tiền:       [Tổng tiền giỏ hàng]
Nội dung:      SAOKE [SĐT bạn nhập] [Tên bạn nhập]
```

## 📱 Test với điện thoại:

1. Mở app ngân hàng trên điện thoại
2. Chọn "Quét mã QR" hoặc "Chuyển khoản QR"
3. Quét mã QR trên màn hình web
4. Kiểm tra xem app có tự động điền:
   - ✅ Số tài khoản: **6930278729**
   - ✅ Tên người nhận: **NGUYEN VAN NGHIA**
   - ✅ Số tiền: [Đúng với tổng đơn hàng]
   - ✅ Nội dung: **SAOKE [SĐT] [Tên]**

## ⚠️ Nếu muốn thay đổi thông tin:

Mở file: `src/pages/Checkout.jsx` - Dòng 25-29

```javascript
const bankAccountInfo = {
  accountNumber: '6930278729',        // ← Đổi số TK ở đây
  accountName: 'NGUYEN VAN NGHIA',    // ← Đổi tên ở đây (VIẾT HOA, KHÔNG DẤU)
  prefix: 'SAOKE'                     // ← Đổi prefix ở đây
};
```

**Lưu ý quan trọng:**
- Tên phải VIẾT HOA: `NGUYEN VAN NGHIA` ✅
- KHÔNG viết thường: `nguyen van nghia` ❌
- KHÔNG có dấu: `Nguyễn Văn Nghĩa` ❌

## 🎨 Giao diện chuyên nghiệp:

- ✅ Layout 2 cột đẹp mắt
- ✅ Mã QR động theo ngân hàng
- ✅ Thông tin rõ ràng, dễ đọc
- ✅ Responsive mobile
- ✅ Animation mượt mà
- ✅ Icon đầy đủ
- ✅ Color scheme xanh lá chuyên nghiệp

## 🚀 Server đang chạy:

URL: **http://localhost:3001/**

Mở trình duyệt và test ngay! 🎉

---

**Mọi thứ đã sẵn sàng để demo!** ✨
