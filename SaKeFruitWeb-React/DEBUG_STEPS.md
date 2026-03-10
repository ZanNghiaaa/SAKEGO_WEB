# 🔍 CÁC BƯỚC KIỂM TRA VÀ DEBUG

## 1. Kiểm tra Dev Server
- ✅ Dev server đang chạy trên: `http://localhost:3001`
- Mở trình duyệt và truy cập link trên

## 2. Mở Console của Browser
- Nhấn **F12** để mở Developer Tools
- Chuyển sang tab **Console**
- Quan sát xem có lỗi màu đỏ nào không

## 3. Test Chức Năng "Thêm vào giỏ hàng"

### Bước 1: Từ trang chủ
1. Mở `http://localhost:3001`
2. Tìm bất kỳ sản phẩm nào
3. Nhấn nút **"Thêm vào giỏ"** (màu xanh)
4. **Kiểm tra:**
   - ✅ Popup thông báo xanh xuất hiện: "Đã thêm vào giỏ!"
   - ✅ Số lượng ở icon giỏ hàng (góc phải) tăng lên: từ 0 → 1
   - ✅ Popup tự động ẩn sau 2 giây

### Bước 2: Từ trang Products
1. Nhấn menu **"Sản Phẩm"**
2. Chọn 1 sản phẩm
3. Nhấn **"Thêm vào giỏ"**
4. **Kiểm tra:**
   - ✅ Popup xuất hiện
   - ✅ Số ở icon giỏ hàng tăng lên

### Bước 3: Từ trang Chi Tiết
1. Nhấn vào bất kỳ sản phẩm nào để xem chi tiết
2. Thử thay đổi số lượng: Nhấn + để tăng lên 3
3. Nhấn **"Thêm vào giỏ hàng"**
4. **Kiểm tra:**
   - ✅ Popup hiện: "Đã thêm 3 sản phẩm vào giỏ hàng!"
   - ✅ Số ở icon giỏ hàng tăng thêm 3

## 4. Test Chức Năng "Mua ngay"

### Từ trang Products (sản phẩm trial)
1. Tìm sản phẩm có icon 🎁 và nút **"Mua thử ngay"** màu vàng
   - Ví dụ: "Trial Chip Dâu", "Trial Mochi Dâu", "Trial Bột Dâu"
2. Nhấn nút **"Mua thử ngay"**
3. **Kiểm tra:**
   - ✅ Sản phẩm được thêm vào giỏ hàng
   - ✅ Tự động chuyển đến trang `/checkout`
   - ✅ Trang Checkout hiển thị sản phẩm vừa thêm trong "Đơn Hàng Của Bạn"

### Từ trang Chi Tiết
1. Vào chi tiết 1 sản phẩm
2. Chọn số lượng: 2
3. Nhấn **"Mua ngay"** (nút vàng)
4. **Kiểm tra:**
   - ✅ Chuyển đến trang Checkout
   - ✅ Hiển thị 2 sản phẩm trong Order Summary

## 5. Kiểm tra Giỏ Hàng

1. Nhấn vào **icon giỏ hàng** (góc phải header)
2. **Kiểm tra:**
   - ✅ Trang Cart hiển thị tất cả sản phẩm đã thêm
   - ✅ Hiển thị đúng ảnh, tên, giá, số lượng
   - ✅ Tổng tiền hiển thị đúng

3. **Test các nút:**
   - Nhấn **+** : Số lượng tăng, tổng tiền cập nhật
   - Nhấn **-** : Số lượng giảm, tổng tiền cập nhật
   - Nhấn **Xóa**: Sản phẩm biến mất
   - Nhấn **Thanh Toán**: Chuyển đến trang Checkout

## 6. Kiểm tra LocalStorage (Dữ liệu lưu trữ)

1. Mở **Developer Tools** (F12)
2. Chuyển sang tab **Application**
3. Bên trái chọn: **Local Storage** → `http://localhost:3001`
4. **Kiểm tra các key:**
   - ✅ `cart`: Chứa mảng JSON các sản phẩm trong giỏ
   - ✅ `currentUser`: Thông tin user đã đăng nhập (nếu có)
   - ✅ `users`: Mảng tất cả user đã đăng ký

5. **Xem dữ liệu cart:**
   - Click vào key `cart`
   - Bên phải hiển thị giá trị (JSON array)
   - Mỗi sản phẩm có: `id`, `name`, `price`, `quantity`, `image`, etc.

## 7. Các Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi 1: Nhấn nút không có phản ứng
**Nguyên nhân:** Code chưa được load lại
**Khắc phục:**
```bash
# Trong terminal, nhấn Ctrl + C để stop
# Sau đó chạy lại:
npm run dev
```

### Lỗi 2: Số giỏ hàng không cập nhật
**Nguyên nhân:** Navbar chưa re-render
**Khắc phục:**
- Refresh trang (F5)
- Kiểm tra Console có lỗi không

### Lỗi 3: "Giỏ hàng trống" khi đã thêm sản phẩm
**Nguyên nhân:** localStorage bị xóa hoặc sai domain
**Khắc phục:**
1. Mở Console
2. Gõ: `localStorage.getItem('cart')`
3. Nếu trả về `null`:
   - Thêm lại sản phẩm
   - Kiểm tra: `localStorage.getItem('cart')` phải có dữ liệu

### Lỗi 4: Popup không xuất hiện
**Nguyên nhân:** CSS chưa load hoặc state không cập nhật
**Khắc phục:**
1. Kiểm tra file `style.css` có class `.add-to-cart-notification`
2. Kiểm tra Console có lỗi CSS
3. Hard refresh: **Ctrl + Shift + R**

### Lỗi 5: Không chuyển sang trang Checkout
**Nguyên nhân:** React Router không hoạt động
**Khắc phục:**
1. Kiểm tra Console có lỗi routing
2. Kiểm tra URL có thay đổi thành `/checkout`
3. Nếu URL đổi nhưng trang không load: Refresh (F5)

## 8. Test Kịch Bản Đầy Đủ

### Kịch bản 1: Mua hàng từ trang chủ
1. ✅ Vào trang chủ
2. ✅ Nhấn "Thêm vào giỏ" ở 3 sản phẩm khác nhau
3. ✅ Kiểm tra icon giỏ hàng = 3
4. ✅ Nhấn icon giỏ hàng → Vào trang Cart
5. ✅ Xem 3 sản phẩm hiển thị đúng
6. ✅ Nhấn "Thanh Toán"
7. ✅ Điền form và đặt hàng

### Kịch bản 2: Mua thử sản phẩm trial
1. ✅ Vào trang Products
2. ✅ Tìm sản phẩm có 🎁 "Dùng Thử"
3. ✅ Nhấn "Mua thử ngay"
4. ✅ Tự động chuyển đến Checkout
5. ✅ Sản phẩm hiển thị trong Order Summary
6. ✅ Điền thông tin và đặt hàng

### Kịch bản 3: Mua nhiều số lượng
1. ✅ Vào chi tiết sản phẩm
2. ✅ Tăng số lượng lên 5
3. ✅ Nhấn "Thêm vào giỏ hàng"
4. ✅ Vào Cart → Kiểm tra số lượng = 5
5. ✅ Thử tăng/giảm số lượng trong Cart
6. ✅ Thanh toán

## 9. Checklist Cuối Cùng

Sau khi test xong, đánh dấu ✅ các mục sau:

- [ ] Thêm vào giỏ từ Home: Popup hiện + số tăng
- [ ] Thêm vào giỏ từ Products: Popup hiện + số tăng  
- [ ] Thêm vào giỏ từ Detail: Popup hiện + số tăng theo quantity
- [ ] Nút "Mua thử ngay" (trial): Chuyển đến Checkout
- [ ] Nút "Mua ngay" (detail): Chuyển đến Checkout
- [ ] Icon giỏ hàng cập nhật số lượng realtime
- [ ] Trang Cart hiển thị đúng sản phẩm
- [ ] Tăng/giảm số lượng trong Cart hoạt động
- [ ] Xóa sản phẩm trong Cart hoạt động
- [ ] Trang Checkout hiển thị Order Summary đúng
- [ ] Đặt hàng thành công → Giỏ hàng xóa sạch

## 10. Liên Hệ Debug Thêm

Nếu vẫn gặp vấn đề, hãy cung cấp:
1. **Screenshot của Console** (F12 → Console tab)
2. **Screenshot của Network** (F12 → Network tab) khi nhấn nút
3. **Giá trị localStorage**: `console.log(localStorage.getItem('cart'))`
4. **Mô tả chi tiết**: Nhấn nút nào → Kết quả gì → Mong đợi gì

---

## ✅ Xong! Hãy bắt đầu test theo từng bước ở trên nhé! 🚀
