import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProductsFromAPI, getProductsByCategory, searchProducts } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

const Products = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, withLoading } = useLoading();
  const { addToCart } = useCart();

  // Load products from API on mount
  useEffect(() => {
    withLoading(async () => {
      const products = await fetchProductsFromAPI();
      setFilteredProducts(products);
    }, 300);
  }, []);

  useEffect(() => {
    // Check if category filter was passed from navigation
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    
    if (category) {
      handleFilter(category);
    }
  }, [location]);

  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchTerm('');
    setFilteredProducts(getProductsByCategory(category));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFilteredProducts(searchProducts(searchTerm));
      setActiveFilter('search');
    } else {
      handleFilter('all');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Đã thêm ${product.name} vào giỏ hàng!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <>
      {isLoading && <Loading message="Đang tải sản phẩm..." />}
      <main>
        {/* Products Header */}
        <section className="products-header">
        <div className="container">
          <h1><i className="fas fa-box-open"></i> Sản Phẩm SAKEGO</h1>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '30px auto' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '50px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <button 
                type="submit"
                className="btn-primary-hero"
                style={{ 
                  borderRadius: '50px',
                  padding: '15px 30px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="fas fa-search"></i> Tìm
              </button>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              <i className="fas fa-th"></i> Tất cả
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'tea' ? 'active' : ''}`}
              onClick={() => handleFilter('tea')}
            >
              <i className="fas fa-mug-hot"></i> Trà Sa Kê
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'rice-milk' ? 'active' : ''}`}
              onClick={() => handleFilter('rice-milk')}
            >
              <i className="fas fa-glass-whiskey"></i> Sữa Gạo Sa Kê
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'mochi' ? 'active' : ''}`}
              onClick={() => handleFilter('mochi')}
            >
              <i className="fas fa-cookie"></i> Bánh Mochi Sa Kê
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <p style={{ fontSize: '16px', color: '#666' }}>
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              {searchTerm && ` cho "${searchTerm}"`}
              {activeFilter !== 'all' && activeFilter !== 'search' && ` trong danh mục "${
                activeFilter === 'tea' ? 'Trà Sa Kê' :
                activeFilter === 'rice-milk' ? 'Sữa Gạo Sa Kê' :
                activeFilter === 'mochi' ? 'Bánh Mochi Sa Kê' : ''
              }"`}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <i className="fas fa-search" style={{ 
                fontSize: '80px', 
                color: '#E0E0E0',
                marginBottom: '20px',
                display: 'block'
              }}></i>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>Không tìm thấy sản phẩm</h3>
              <p style={{ color: '#999', marginBottom: '30px' }}>
                Thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm
              </p>
              <button 
                className="btn-primary-hero"
                onClick={() => {
                  setSearchTerm('');
                  handleFilter('all');
                }}
              >
                <i className="fas fa-redo"></i> Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
    </>
  );
};

export default Products;
