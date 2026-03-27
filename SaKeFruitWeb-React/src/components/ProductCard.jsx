import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    e.preventDefault();
    console.log('Add to cart clicked:', product.name);
    if (onAddToCart) {
      onAddToCart(product);
      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Buy now clicked:', product.name);
    if (onAddToCart) {
      onAddToCart(product);
    }
    // Navigate to checkout
    console.log('Navigating to checkout...');
    navigate('/checkout');
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'chip':
        return { name: 'Chip', color: '#FFB74D' };
      case 'mochi':
        return { name: 'Bánh Mochi', color: '#AB47BC' };
      case 'powder':
        return { name: 'Bột', color: '#66BB6A' };
      case 'tea':
        return { name: 'Trà Sa Kê', color: '#7CB342' };
      case 'rice-milk':
        return { name: 'Sữa Gạo', color: '#FFA726' };
      case 'combo':
        return { name: 'Combo', color: '#EF5350' };
      default:
        return { name: 'Sa Kê', color: '#7CB342' };
    }
  };

  const categoryInfo = getCategoryInfo(product.category);

  return (
    <div 
      className={`product-card ${product.isTrial ? 'trial-product-card' : ''}`}
      style={{ position: 'relative' }}
    >
      {showNotification && (
        <div className="add-to-cart-notification">
          <i className="fas fa-check-circle"></i> Đã thêm vào giỏ!
        </div>
      )}
      <span className="product-badge" style={{ backgroundColor: categoryInfo.color }}>
        {categoryInfo.name}
      </span>
      {product.isBestSeller && (
        <span className="best-seller-badge">
          ⭐ BEST SELLER
        </span>
      )}
      {product.isCombo && product.discount && (
        <span className="combo-discount-badge">
          🎁 -{Math.round(product.discount)}%
        </span>
      )}
      {product.isTrial && <span className="trial-badge">🎁 Dùng Thử</span>}
      {product.isReadyToEat && (
        <span className="ready-to-eat-badge">
          <i className="fas fa-utensils"></i> Ăn liền
        </span>
      )}
      <div 
        className="product-image"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={product.image} 
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <h3
          onClick={handleCardClick}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>
        <p>{product.description}</p>
        <div className="product-price-container">
          {product.isCombo && product.originalPrice ? (
            <>
              <p className="product-price-original">{product.originalPrice.toLocaleString('vi-VN')}đ</p>
              <p className="product-price product-price-combo">{product.price.toLocaleString('vi-VN')}đ</p>
            </>
          ) : (
            <p className="product-price">{product.price.toLocaleString('vi-VN')}đ</p>
          )}
        </div>
        
        <div className="product-buttons-grid">
          <button 
            className="btn-action-card btn-add-to-cart-card" 
            onClick={handleAddToCart}
            type="button"
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Thêm vào giỏ</span>
          </button>
          
          {product.isTrial && (
            <button 
              className="btn-action-card btn-buy-trial" 
              onClick={handleBuyNow}
              type="button"
            >
              <i className="fas fa-bolt"></i>
              <span>Mua thử ngay</span>
            </button>
          )}
          
          <button 
            className="btn-action-card btn-view-detail-card"
            onClick={handleCardClick}
            type="button"
          >
            <i className="fas fa-eye"></i>
            <span>Xem chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
