import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

function YourPage() {
  const { isLoading, withLoading } = useLoading();

  const handleAction = async () => {
    await withLoading(async () => {
      // Your async code here
    }, 1000); // Minimum 1s
  };

  return (
    <>
      {isLoading && <Loading message="Đang tải..." />}
      {/* Your content */}
    </>
  );
}# 🎨 Loading Animation - Hướng Dẫn Sử Dụng

## 📦 Component đã tạo

### 1. **Loading Component** (`src/components/Loading.jsx`)
Component hiển thị animation loading với linh vật Sa Ô Kê

### 2. **useLoading Hook** (`src/hooks/useLoading.js`)
Custom hook để quản lý trạng thái loading dễ dàng

### 3. **Loading CSS** (`src/assets/css/loading.css`)
File CSS với các animation chuyên nghiệp

---

## 🚀 Cách Sử Dụng

### **Cách 1: Sử dụng trực tiếp Component**

```jsx
import Loading from '../components/Loading';

function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <Loading 
          fullScreen={true}
          message="Đang tải sản phẩm..."
        />
      )}
      {/* Nội dung trang của bạn */}
    </>
  );
}
```

### **Cách 2: Sử dụng với useLoading Hook** (Khuyến nghị)

```jsx
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

function ProductsPage() {
  const { isLoading, withLoading } = useLoading();

  const fetchProducts = async () => {
    await withLoading(async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }, 1000); // Loading tối thiểu 1 giây
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {isLoading && <Loading message="Đang tải sản phẩm..." />}
      {/* Danh sách sản phẩm */}
    </>
  );
}
```

### **Cách 3: Loading cho form submit**

```jsx
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

function LoginPage() {
  const { isLoading, withLoading } = useLoading();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    await withLoading(async () => {
      const result = await loginUser(email, password);
      if (result.success) {
        navigate('/');
      }
    });
  };

  return (
    <>
      {isLoading && <Loading message="Đang đăng nhập..." />}
      <form onSubmit={handleLogin}>
        {/* Form fields */}
      </form>
    </>
  );
}
```

---

## ⚙️ Props của Loading Component

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `fullScreen` | boolean | `true` | Hiển thị toàn màn hình hay không |
| `message` | string | `"Đang tải..."` | Text hiển thị dưới animation |

---

## 🎯 Các Animation Được Sử Dụng

1. **Float Animation**: Linh vật bay lên xuống
2. **Bounce Rotate**: Linh vật xoay nhẹ qua lại
3. **Pulse Glow**: Hiệu ứng phát sáng xung quanh
4. **Shadow Pulse**: Bóng đổ co giãn
5. **Spinner Ring**: Vòng tròn xoay 3 lớp
6. **Bouncing Dots**: 3 chấm nhảy lần lượt
7. **Progress Bar**: Thanh tiến trình gradient

---

## 🎨 Tùy Chỉnh

### Thay đổi màu sắc
Chỉnh sửa trong `loading.css`:
```css
/* Thay đổi màu gradient */
.mascot-glow {
  background: radial-gradient(circle, 
    rgba(YOUR_COLOR) 0%, 
    transparent 70%);
}
```

### Thay đổi kích thước linh vật
```css
.mascot-image {
  width: 180px;  /* Tăng/giảm kích thước */
  height: 180px;
}
```

---

## 📱 Responsive

Loading tự động responsive cho mobile:
- Linh vật nhỏ hơn trên mobile
- Spinner và progress bar điều chỉnh kích thước
- Text size giảm phù hợp

---

## 💡 Tips

1. **Luôn set minimum delay**: Tránh loading hiện/ẩn quá nhanh gây nhấp nháy
2. **Customize message**: Đổi message phù hợp với từng action
3. **Sử dụng fullScreen=false**: Cho loading trong một phần trang
4. **Kết hợp với Error Handling**: Nhớ xử lý lỗi trong withLoading

---

## 🔧 Tích Hợp Vào App

### Thêm vào App.jsx (Global Loading)
```jsx
import { useLoading } from './hooks/useLoading';
import Loading from './components/Loading';

function App() {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <Loading />}
      {/* Routes */}
    </>
  );
}
```

---

## ✨ Demo

Xem demo tại: `src/pages/LoadingDemo.jsx`

Chạy app và truy cập route để xem demo hoạt động.

---

**Chúc bạn sử dụng hiệu quả! 🎉**
