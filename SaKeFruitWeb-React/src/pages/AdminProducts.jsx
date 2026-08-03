import React, { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getProductCategories,
  fetchProductsFromAPI
} from '../controllers/ProductController';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({
    all: { name: 'Tất cả', count: 0 },
    tea: { name: 'Trà Sa Kê', count: 0 },
    'rice-milk': { name: 'Sữa Gạo Sa Kê', count: 0 },
    mochi: { name: 'Bánh Mochi Sa Kê', count: 0 },
    combo: { name: 'Combo Sa Kê', count: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'tea',
    stock: '',
    isTrial: false,
    isReadyToEat: true,
    // Combo fields
    isCombo: false,
    originalPrice: '',
    discount: '',
    isBestSeller: false
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      await fetchProductsFromAPI();
      setProducts(getAllProducts());
      setCategories(getProductCategories());
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh products
  const refreshProducts = async () => {
    await loadProducts();
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Upload image to server (Local version: returns base64 data URI directly)
  const uploadImageToServer = async () => {
    if (!imageFile) return null;
    return imagePreview;
  };

  // Open add modal
  const handleAddProduct = () => {
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'tea',
      stock: '',
      isTrial: false,
      isReadyToEat: true,
      // Combo fields
      isCombo: false,
      originalPrice: '',
      discount: '',
      isBestSeller: false
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product.image || '');
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      isTrial: product.isTrial,
      isReadyToEat: product.isReadyToEat,
      // Combo fields
      isCombo: product.isCombo || false,
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      isBestSeller: product.isBestSeller || false
    });
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image first if selected
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImageToServer();
        if (!imageUrl) {
          alert('Lỗi khi upload ảnh!');
          return;
        }
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: imageUrl,
        description: formData.description,
        category: formData.category,
        stock: parseInt(formData.stock),
        isTrial: formData.isTrial,
        isReadyToEat: formData.isReadyToEat,
        isCombo: formData.isCombo,
        isBestSeller: formData.isBestSeller
      };

      // Chỉ thêm combo fields nếu isCombo = true
      if (formData.isCombo) {
        if (formData.originalPrice) {
          productData.originalPrice = parseFloat(formData.originalPrice);
        }
        if (formData.discount) {
          productData.discount = parseFloat(formData.discount);
        }
      }

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Add new product
        await addProduct(productData);
        alert('Thêm sản phẩm thành công!');
      }

      await refreshProducts();
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        alert('Xóa sản phẩm thành công!');
        await refreshProducts();
      } catch (error) {
        alert('Lỗi: ' + error.message);
      }
    }
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      tea: 'Trà Sa Kê',
      'rice-milk': 'Sữa Gạo Sa Kê',
      mochi: 'Bánh Mochi Sa Kê',
      combo: 'Combo Sa Kê'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="admin-products">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#7CB342', marginBottom: '16px', display: 'block' }} />
            <p style={{ margin: 0 }}>Đang tải sản phẩm...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-box"></i> Quản Lý Sản Phẩm
          </h1>
          <p className="admin-header-subtitle">
            Quản lý danh sách sản phẩm Sa Kê - Tổng cộng {products.length} sản phẩm
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Filter and Search */}
      <div className="admin-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            <i className="fas fa-th"></i>
            <span>Tất cả</span>
            <span className="count-badge">{categories.all.count}</span>
          </button>
          <button 
            className={`filter-tab ${filterCategory === 'tea' ? 'active' : ''}`}
            onClick={() => setFilterCategory('tea')}
          >
            <i className="fas fa-leaf"></i>
            <span>Trà Sa Kê</span>
            <span className="count-badge">{categories.tea.count}</span>
          </button>
          <button 
            className={`filter-tab ${filterCategory === 'rice-milk' ? 'active' : ''}`}
            onClick={() => setFilterCategory('rice-milk')}
          >
            <i className="fas fa-glass-whiskey"></i>
            <span>Sữa Gạo Sa Kê</span>
            <span className="count-badge">{categories['rice-milk'].count}</span>
          </button>
          <button 
            className={`filter-tab ${filterCategory === 'mochi' ? 'active' : ''}`}
            onClick={() => setFilterCategory('mochi')}
          >
            <i className="fas fa-cookie-bite"></i>
            <span>Bánh Mochi Sa Kê</span>
            <span className="count-badge">{categories.mochi.count}</span>
          </button>
        </div>

        <div className="search-box-admin">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="dashboard-card">
        <div className="table-responsive">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 11, color: 'var(--green-500)',
                        background: 'rgba(124,179,66,0.1)', padding: '2px 7px', borderRadius: 5
                      }}>
                        #{String(product._id || product.id).slice(-6)}
                      </span>
                    </td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumbnail"
                        style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--admin-border)' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: 13, marginBottom: 4 }}>
                          {product.name}
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {product.isTrial && (
                            <span style={{
                              fontSize: 10, padding: '2px 7px',
                              background: 'rgba(233,30,99,0.15)', color: '#f472b6',
                              borderRadius: 4, fontWeight: 700
                            }}>Dùng thử</span>
                          )}
                          {product.isReadyToEat && (
                            <span style={{
                              fontSize: 10, padding: '2px 7px',
                              background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                              borderRadius: 4, fontWeight: 700
                            }}>Ăn liền</span>
                          )}
                          {product.isCombo && (
                            <span style={{
                              fontSize: 10, padding: '2px 7px',
                              background: 'rgba(168,85,247,0.15)', color: '#c084fc',
                              borderRadius: 4, fontWeight: 700
                            }}>Combo</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: 'var(--admin-text-dim)',
                        background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 5
                      }}>
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong className="text-success" style={{ fontSize: 14 }}>
                          {product.price.toLocaleString('vi-VN')}đ
                        </strong>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>
                            {product.originalPrice.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700, fontSize: 14,
                        color: product.stock > 50 ? '#4ade80' : product.stock > 0 ? '#fbbf24' : '#f87171'
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.stock > 0 ? (
                        <span className="status-badge status-completed">Còn hàng</span>
                      ) : (
                        <span className="status-badge status-cancelled">Hết hàng</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-action-edit"
                          onClick={() => handleEditProduct(product)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-action btn-action-delete"
                          onClick={() => handleDeleteProduct(product)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-box"></i> 
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên sản phẩm <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục <span className="text-danger">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="tea">Trà Sa Kê</option>
                      <option value="rice-milk">Sữa Gạo Sa Kê</option>
                      <option value="mochi">Bánh Mochi Sa Kê</option>
                      <option value="combo">Combo Sa Kê</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá (VNĐ) <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Hình ảnh</label>
                    
                    {/* Image Preview */}
                    {(imagePreview || formData.image) && (
                      <div style={{ marginBottom: '15px', position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={imageFile ? imagePreview : formData.image} 
                          alt="Preview" 
                          style={{ 
                            width: '200px', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #ddd'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    
                    {/* File Input */}
                    <div style={{ marginBottom: '10px' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{
                          display: 'block',
                          padding: '10px',
                          border: '2px dashed #7CB342',
                          borderRadius: '8px',
                          width: '100%',
                          cursor: 'pointer',
                          background: '#f9f9f9'
                        }}
                      />
                      <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        <i className="fas fa-info-circle"></i> Chọn file ảnh từ máy tính (tối đa 5MB, định dạng: JPG, PNG, GIF, WEBP)
                      </small>
                    </div>

                    {/* URL Input (Alternative) */}
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                      <label style={{ fontSize: '14px', color: '#666', marginBottom: '5px', display: 'block' }}>
                        Hoặc nhập URL ảnh
                      </label>
                      <input 
                        type="text" 
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="http://... hoặc /assets/images/..."
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Mô tả <span className="text-danger">*</span></label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      placeholder="Nhập mô tả sản phẩm"
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isReadyToEat"
                          checked={formData.isReadyToEat}
                          onChange={handleInputChange}
                        />
                        <span>Sản phẩm ăn liền</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isTrial"
                          checked={formData.isTrial}
                          onChange={handleInputChange}
                        />
                        <span>Gói dùng thử</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isCombo"
                          checked={formData.isCombo}
                          onChange={handleInputChange}
                        />
                        <span>🎁 Sản phẩm Combo</span>
                      </label>

                      {formData.isCombo && (
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isBestSeller"
                            checked={formData.isBestSeller}
                            onChange={handleInputChange}
                          />
                          <span>⭐ Best Seller</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Combo Fields - Only show when isCombo is checked */}
                  {formData.isCombo && (
                    <>
                      <div className="form-group">
                        <label>Giá gốc (VNĐ)</label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                          Giá gốc trước khi giảm (để trống nếu không có)
                        </small>
                      </div>

                      <div className="form-group">
                        <label>Giảm giá (%)</label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                          Phần trăm giảm giá (0-100%)
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang upload...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> 
                      {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
