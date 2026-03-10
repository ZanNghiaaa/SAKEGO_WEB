# SaKeFruit React - Dự án chuyển đổi từ HTML sang React

## 📁 Cấu trúc dự án

```
SaKeFruitWeb-React/
├── public/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   └── responsive.css
│   │   └── images/
│   ├── components/
│   │   ├── Banner.jsx
│   │   ├── Carousel.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProductCard.jsx
│   ├── controllers/
│   │   └── ProductController.js
│   ├── hooks/
│   │   └── useCart.js
│   ├── pages/
│   │   ├── Cart.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   └── Products.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Cài đặt và chạy dự án

### 1. Cài đặt dependencies

```bash
cd SaKeFruitWeb-React
npm install
```

### 2. Chạy dự án ở chế độ development

```bash
npm run dev
```

Dự án sẽ chạy tại: http://localhost:3000

### 3. Build dự án

```bash
npm run build
```

### 4. Preview bản build

```bash
npm run preview
```

## 🎯 Các tính năng đã được chuyển đổi

### ✅ Components

- **Navbar**: Thanh điều hướng responsive với menu mobile
- **Footer**: Phần footer với thông tin liên hệ
- **Banner**: Header banner động
- **Carousel**: Slider hiển thị khuyến mãi
- **ProductCard**: Card hiển thị sản phẩm
- **Layout**: Layout tổng chứa Navbar và Footer

### ✅ Pages

- **Home**: Trang chủ với banner, carousel, và sản phẩm nổi bật
- **Products**: Trang sản phẩm với filter và search
- **Cart**: Giỏ hàng với quản lý số lượng
- **Contact**: Trang liên hệ với form

### ✅ Controllers/Hooks

- **ProductController**: Quản lý dữ liệu sản phẩm (Model)
- **useCart**: Hook quản lý giỏ hàng với localStorage

### ✅ Routing

- React Router được sử dụng để điều hướng giữa các trang
- URL đẹp và SEO-friendly

## 📝 Mô hình MVC trong React

### Model (Controller)
- `ProductController.js`: Quản lý dữ liệu sản phẩm, filter, search

### View (Components + Pages)
- **Components**: Các thành phần UI có thể tái sử dụng
- **Pages**: Các trang chính của ứng dụng

### Controller (Hooks)
- `useCart.js`: Logic xử lý giỏ hàng (thêm, xóa, cập nhật)

## 🎨 CSS & Styling

- Giữ nguyên toàn bộ CSS từ dự án HTML gốc
- Sử dụng Bootstrap 5 cho responsive design
- Font Awesome 6 cho icons
- Google Fonts (Roboto)

## 🔧 Công nghệ sử dụng

- **React 18**: Framework UI
- **React Router DOM 6**: Routing
- **Vite**: Build tool nhanh
- **Bootstrap 5**: CSS framework
- **Font Awesome 6**: Icon library

## 📱 Responsive Design

Dự án đã được tối ưu cho tất cả các thiết bị:
- Desktop (>1200px)
- Tablet (768px - 1199px)
- Mobile (<768px)

## 🛒 Tính năng giỏ hàng

- Thêm sản phẩm vào giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Lưu giỏ hàng vào localStorage
- Tính tổng tiền tự động

## 🔄 So sánh với phiên bản HTML

| Tính năng | HTML | React |
|-----------|------|-------|
| Routing | Multiple HTML files | Single Page App với React Router |
| State Management | localStorage + global variables | React Hooks (useState, useEffect) |
| Component Reusability | Copy-paste HTML | Reusable React Components |
| Data Management | Inline JavaScript | Separated Controllers |
| Build Process | None | Vite bundler |
| Development Server | Local server (Live Server) | Vite dev server with HMR |

## 📚 Hướng dẫn phát triển thêm

### Thêm trang mới

1. Tạo file trong `src/pages/` (ví dụ: `About.jsx`)
2. Thêm route trong `App.jsx`

```jsx
<Route path="about" element={<About />} />
```

### Thêm component mới

1. Tạo file trong `src/components/`
2. Import và sử dụng trong page hoặc component khác

### Thêm sản phẩm mới

Chỉnh sửa file `src/controllers/ProductController.js`

## 🐛 Troubleshooting

### Port đã được sử dụng

Thay đổi port trong `vite.config.js`:

```js
server: {
  port: 3001
}
```

### CSS không load

Đảm bảo đã import CSS trong `App.jsx`

## 📞 Liên hệ

- Email: info@sakefruit.com
- Phone: 0123 456 789

---

**Developed with ❤️ by SaKeFruit Team**
