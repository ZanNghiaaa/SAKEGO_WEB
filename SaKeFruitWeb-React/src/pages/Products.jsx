import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProductsFromAPI, getProductsByCategory, searchProducts } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';

const FILTERS = [
  { key: 'all',       label: 'Tất cả',          icon: 'fas fa-th' },
  { key: 'tea',       label: 'Trà Sa Kê',        icon: 'fas fa-mug-hot' },
  { key: 'rice-milk', label: 'Sữa Gạo Sa Kê',   icon: 'fas fa-glass-whiskey' },
  { key: 'mochi',     label: 'Bánh Mochi Sa Kê', icon: 'fas fa-cookie' },
  { key: 'combo',     label: 'Combo Sa Kê',      icon: 'fas fa-gift' },
];

const CATEGORY_LABELS = {
  tea: 'Trà Sa Kê', 'rice-milk': 'Sữa Gạo Sa Kê',
  mochi: 'Bánh Mochi Sa Kê', combo: 'Combo Sa Kê',
};

const Products = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, withLoading } = useLoading();
  const { addToCart } = useCart();

  useEffect(() => {
    withLoading(async () => {
      const products = await fetchProductsFromAPI();
      setFilteredProducts(products);
    }, 300);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) handleFilter(category);
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
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `<i class="fas fa-check-circle"></i> Đã thêm ${product.name} vào giỏ hàng!`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  };

  const resultLabel = activeFilter !== 'all' && activeFilter !== 'search'
    ? ` trong "${CATEGORY_LABELS[activeFilter] || ''}"` : '';

  return (
    <>
      {isLoading && <Loading message="Đang tải sản phẩm..." />}
      <main>

        {/* ── HERO HEADER ── */}
        <section className="products-hero">
          <div className="products-hero-overlay"></div>

          {/* Particles */}
          <div className="products-hero-particles" aria-hidden="true">
            <span className="ph-orb ph-orb-1"></span>
            <span className="ph-orb ph-orb-2"></span>
            <span className="ph-orb ph-orb-3"></span>
            <span className="ph-leaf ph-leaf-1"><i className="fas fa-leaf"></i></span>
            <span className="ph-leaf ph-leaf-2"><i className="fas fa-leaf"></i></span>
            <span className="ph-leaf ph-leaf-3"><i className="fas fa-leaf"></i></span>
            <span className="ph-ring ph-ring-1"></span>
            <span className="ph-ring ph-ring-2"></span>
          </div>

          <div className="container">
            <div className="products-hero-content">
              <span className="products-hero-eyebrow">
                <span className="eyebrow-dot"></span>
                Cửa hàng SAKEGO
              </span>
              <h1 className="products-hero-title">
                Sản Phẩm <span className="ph-accent">Sa Kê</span> Nguyên Chất
              </h1>
              <p className="products-hero-desc">
                Khám phá trọn bộ sản phẩm từ thiên nhiên — trà, sữa gạo, mochi và combo đặc biệt
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="products-search-form">
                <div className="products-search-inner">
                  <i className="fas fa-search products-search-icon"></i>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm sa kê..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="products-search-input"
                  />
                  <button type="submit" className="products-search-btn">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Wave bottom */}
          <div className="products-hero-wave" aria-hidden="true">
            <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
              <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#fafafa"/>
            </svg>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <section className="products-filter-section">
          <div className="container">
            <div className="products-filter-bar">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`pf-btn${activeFilter === f.key ? ' active' : ''}`}
                  onClick={() => handleFilter(f.key)}
                >
                  <i className={f.icon}></i>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS GRID ── */}
        <section className="products-grid-section">
          <div className="container">
            <div className="products-result-meta">
              <span className="result-count">
                <i className="fas fa-box-open"></i>
                <strong>{filteredProducts.length}</strong> sản phẩm
                {searchTerm && ` cho "${searchTerm}"`}
                {resultLabel}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid products-grid-animated">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="product-card-wrapper"
                    style={{ animationDelay: `${idx * 0.07}s` }}
                  >
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <div className="products-empty-icon">
                  <i className="fas fa-box-open"></i>
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm</p>
                <button
                  className="products-reset-btn"
                  onClick={() => { setSearchTerm(''); handleFilter('all'); }}
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
