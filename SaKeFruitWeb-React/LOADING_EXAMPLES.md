# 🎯 Ví Dụ Sử Dụng Loading Animation

## 📦 Đã Tích Hợp Vào Login Page

File `src/pages/Login.jsx` đã được cập nhật với Loading animation.

### Khi nào Loading hiển thị?
- ✅ Khi user nhấn nút "Đăng nhập"
- ✅ Hiển thị linh vật Sa Ô Kê với animation
- ✅ Tự động ẩn sau khi đăng nhập thành công/thất bại

---

## 🚀 Cách Áp Dụng Cho Các Page Khác

### 1. **Products Page** (Khi load sản phẩm)

```jsx
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

function Products() {
  const { isLoading, withLoading } = useLoading();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    withLoading(async () => {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = ProductController.getAllProducts();
      setProducts(data);
    }, 800);
  }, []);

  return (
    <>
      {isLoading && <Loading message="Đang tải sản phẩm..." />}
      <div className="products-grid">
        {products.map(product => <ProductCard key={product.id} {...product} />)}
      </div>
    </>
  );
}
```

### 2. **Checkout Page** (Khi xử lý thanh toán)

```jsx
function Checkout() {
  const { isLoading, withLoading } = useLoading();

  const handleCheckout = async () => {
    await withLoading(async () => {
      // Xử lý thanh toán
      await processPayment();
      alert('Đặt hàng thành công!');
      navigate('/');
    }, 1500);
  };

  return (
    <>
      {isLoading && <Loading message="Đang xử lý đơn hàng..." />}
      {/* Checkout form */}
    </>
  );
}
```

### 3. **Register Page** (Khi đăng ký)

```jsx
function Register() {
  const { isLoading, withLoading } = useLoading();

  const handleRegister = async (e) => {
    e.preventDefault();
    await withLoading(async () => {
      registerUser(formData);
      navigate('/login');
    }, 1000);
  };

  return (
    <>
      {isLoading && <Loading message="Đang tạo tài khoản..." />}
      {/* Register form */}
    </>
  );
}
```

### 4. **Product Detail** (Khi load chi tiết)

```jsx
function ProductDetail() {
  const { isLoading, withLoading } = useLoading();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    withLoading(async () => {
      const data = ProductController.getProductById(id);
      setProduct(data);
    }, 600);
  }, [id]);

  if (!product) return null;

  return (
    <>
      {isLoading && <Loading message="Đang tải thông tin sản phẩm..." />}
      {/* Product details */}
    </>
  );
}
```

---

## 💡 Tips Quan Trọng

### ✅ DO (Nên làm)
```jsx
// Luôn set minimum delay để tránh nhấp nháy
await withLoading(asyncFunc, 800);

// Customize message phù hợp
<Loading message="Đang tải sản phẩm..." />

// Wrap trong fragment để không ảnh hưởng layout
<>
  {isLoading && <Loading />}
  <YourContent />
</>
```

### ❌ DON'T (Không nên)
```jsx
// Không dùng delay quá ngắn
await withLoading(asyncFunc, 100); // ❌ Quá nhanh

// Không quên xử lý lỗi
await withLoading(async () => {
  // Không có try-catch ❌
});

// Không để loading chặn UI quá lâu
await withLoading(asyncFunc, 5000); // ❌ Quá lâu
```

---

## 🎨 Tùy Chỉnh Message

```jsx
// Đăng nhập
<Loading message="Đang đăng nhập..." />

// Đăng ký
<Loading message="Đang tạo tài khoản..." />

// Load sản phẩm
<Loading message="Đang tải sản phẩm..." />

// Thanh toán
<Loading message="Đang xử lý thanh toán..." />

// Thêm giỏ hàng
<Loading message="Đang thêm vào giỏ..." />

// Upload ảnh
<Loading message="Đang tải ảnh lên..." />
```

---

## 🔧 Troubleshooting

### Loading không hiển thị?
1. Kiểm tra đã import CSS chưa: `import '../assets/css/loading.css'`
2. Kiểm tra isLoading state: `console.log(isLoading)`
3. Đảm bảo có wrap trong `<>{isLoading && <Loading />}</>

### Loading nhấp nháy?
- Tăng minimum delay: `withLoading(func, 1000)`

### Ảnh linh vật không hiển thị?
- Kiểm tra đường dẫn: `src/assets/images/linhvat01.png`
- Đảm bảo file tồn tại

---

## 📱 Test Loading

### Cách test nhanh:
```jsx
// Thêm vào component bất kỳ
const [show, setShow] = useState(false);

return (
  <>
    <button onClick={() => setShow(!show)}>Toggle Loading</button>
    {show && <Loading />}
  </>
);
```

---

**Chúc bạn code vui vẻ! 🎉**
