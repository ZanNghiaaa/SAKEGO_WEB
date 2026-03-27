import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductsFromAPI } from '../controllers/ProductController';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({
    tea: 0,
    'rice-milk': 0,
    mochi: 0,
    combo: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      const products = await fetchProductsFromAPI();
      const counts = {
        tea: products.filter(p => p.category === 'tea').length,
        'rice-milk': products.filter(p => p.category === 'rice-milk').length,
        mochi: products.filter(p => p.category === 'mochi').length,
        combo: products.filter(p => p.category === 'combo').length
      };
      setCategoryCounts(counts);
    };
    loadCounts();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📦 Danh mục</span>
          <h2>Khám Phá Sản Phẩm</h2>
          <p>Đa dạng sản phẩm từ sa kê cho mọi nhu cầu</p>
        </div>
        <div className="categories-grid">
          <div className="category-card" onClick={() => handleCategoryClick('tea')}>
            <div className="category-icon">
              <i className="fas fa-mug-hot"></i>
            </div>
            <h3>Trà Sa Kê</h3>
            <p>Thơm ngon, giàu dưỡng chất</p>
            <div className="category-count">{categoryCounts.tea} sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('rice-milk')}>
            <div className="category-icon">
              <i className="fas fa-glass-whiskey"></i>
            </div>
            <h3>Sữa Gạo Sa Kê</h3>
            <p>Dinh dưỡng, dễ tiêu hóa</p>
            <div className="category-count">{categoryCounts['rice-milk']} sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('mochi')}>
            <div className="category-icon">
              <i className="fas fa-cookie"></i>
            </div>
            <h3>Bánh Mochi Sa Kê</h3>
            <p>Mềm mại, nhiều vị</p>
            <div className="category-count">{categoryCounts.mochi} sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('combo')}>
            <div className="category-icon">
              <i className="fas fa-gift"></i>
            </div>
            <h3>Combo Sa Kê</h3>
            <p>Tiết kiệm, đa dạng</p>
            <div className="category-count">{categoryCounts.combo} sản phẩm</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
