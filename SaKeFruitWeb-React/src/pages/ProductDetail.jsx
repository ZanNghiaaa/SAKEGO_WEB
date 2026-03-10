import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';
import '../assets/css/product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Ensure products are loaded from API
        const { fetchProductsFromAPI } = await import('../controllers/ProductController');
        await fetchProductsFromAPI();
        
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
    
    // Add class to body for breadcrumb styling
    document.body.classList.add('product-detail-page');
    
    return () => {
      document.body.classList.remove('product-detail-page');
    };
  }, [id, navigate]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add product with selected quantity
    const productWithQuantity = { ...product, quantity };
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setNotification(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleBuyNow = () => {
    // Add product with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'chip':
        return { name: 'Chip Sa Kê', color: '#FFB74D', icon: 'cookie-bite' };
      case 'mochi':
        return { name: 'Bánh Mochi', color: '#AB47BC', icon: 'cookie' };
      case 'powder':
        return { name: 'Bột Sa Kê', color: '#66BB6A', icon: 'mortar-pestle' };
      default:
        return { name: 'Sa Kê', color: '#7CB342', icon: 'leaf' };
    }
  };

  if (loading || !product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(product.category);
  // Mock multiple images for product
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  return (
    <main>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <i className="fas fa-home"></i> Trang chủ
            </a>
            <span className="separator">/</span>
            <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
              Sản phẩm
            </a>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="notification-popup">
          <i className="fas fa-check-circle"></i>
          {notification}
        </div>
      )}

      {/* Product Detail */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={productImages[selectedImage]} alt={product.name} />
                {product.isTrial && (
                  <div className="trial-badge-large">
                    <i className="fas fa-gift"></i>
                    <span>Dùng Thử</span>
                  </div>
                )}
              </div>
              <div className="thumbnail-list">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-detail">
              <div className="category-badge" style={{ background: categoryInfo.color }}>
                <i className={`fas fa-${categoryInfo.icon}`}></i>
                {categoryInfo.name}
              </div>

              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <span className="rating-text">5.0 (128 đánh giá)</span>
                <span className="divider">|</span>
                <span className="sold-text">Đã bán: 1,234</span>
              </div>

              <div className="price-section">
                <div className="current-price">
                  {product.price.toLocaleString('vi-VN')}đ
                </div>
                {product.isTrial && (
                  <div className="price-note">
                    <i className="fas fa-info-circle"></i>
                    Giá ưu đãi cho gói dùng thử
                  </div>
                )}
              </div>

              <div className="product-description">
                <h3>
                  <i className="fas fa-file-alt"></i>
                  Mô tả sản phẩm
                </h3>
                <p>{product.description}</p>
              </div>

              <div className="product-features">
                <h3>
                  <i className="fas fa-check-circle"></i>
                  Đặc điểm nổi bật
                </h3>
                <ul>
                  <li>
                    <i className="fas fa-leaf"></i>
                    100% nguyên liệu tự nhiên từ trái sa kê Việt Nam
                  </li>
                  <li>
                    <i className="fas fa-shield-alt"></i>
                    Đảm bảo an toàn vệ sinh thực phẩm
                  </li>
                  <li>
                    <i className="fas fa-award"></i>
                    Chất lượng cao, đã được kiểm nghiệm
                  </li>
                  <li>
                    <i className="fas fa-truck"></i>
                    Giao hàng nhanh chóng toàn quốc
                  </li>
                </ul>
              </div>

              <div className="stock-info">
                <i className="fas fa-box"></i>
                <span>Còn lại: <strong>{product.stock}</strong> sản phẩm</span>
              </div>

              <div className="quantity-selector">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  <i className="fas fa-cart-plus"></i>
                  Thêm vào giỏ hàng
                </button>
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  <i className="fas fa-bolt"></i>
                  Mua ngay
                </button>
              </div>

              <div className="product-guarantee">
                <div className="guarantee-item">
                  <i className="fas fa-sync-alt"></i>
                  <div>
                    <strong>Đổi trả miễn phí</strong>
                    <span>Trong 7 ngày</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <i className="fas fa-shipping-fast"></i>
                  <div>
                    <strong>Miễn phí vận chuyển</strong>
                    <span>Đơn từ 200.000đ</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <i className="fas fa-headset"></i>
                  <div>
                    <strong>Hỗ trợ 24/7</strong>
                    <span>Tư vấn nhiệt tình</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-wrapper">
            <div className="tab-content">
              <div className="tab-panel active">
                <h2>
                  <i className="fas fa-info-circle"></i>
                  Thông tin chi tiết
                </h2>
                <div className="detail-table">
                  <div className="detail-row">
                    <span className="label">Danh mục:</span>
                    <span className="value">{categoryInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Xuất xứ:</span>
                    <span className="value">Việt Nam</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Thương hiệu:</span>
                    <span className="value">SaKeFruit</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hạn sử dụng:</span>
                    <span className="value">12 tháng</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Bảo quản:</span>
                    <span className="value">Nơi khô ráo, thoáng mát</span>
                  </div>
                </div>

                <h3>Mô tả chi tiết</h3>
                <p>
                  {product.name} là sản phẩm được chế biến từ trái sa kê (chôm chôm) tươi ngon, 
                  chọn lọc kỹ lưỡng từ các vùng trồng sa kê nổi tiếng tại Việt Nam. 
                  Quy trình sản xuất hiện đại, đảm bảo giữ nguyên hương vị tự nhiên 
                  và giá trị dinh dưỡng của trái sa kê.
                </p>
                <p>
                  Sản phẩm không chứa chất bảo quản, phẩm màu hay hương liệu tổng hợp. 
                  An toàn tuyệt đối cho sức khỏe người tiêu dùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
