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
    mochi: { name: 'Bánh Mochi Sa Kê', count: 0 }
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
    isReadyToEat: true
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

  // Upload image to server
  const uploadImageToServer = async () => {
    if (!imageFile) return null;

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại!');
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);

    try {
      setUploading(true);
      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Lỗi khi upload ảnh');
      }

      // Return full URL with domain
      return `http://localhost:5000${data.url}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
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
      isReadyToEat: true
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
      isReadyToEat: product.isReadyToEat
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
        ...formData,
        image: imageUrl
      };
      
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
      mochi: 'Bánh Mochi Sa Kê'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="admin-products">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#7CB342', marginBottom: '20px' }}></i>
            <p style={{ color: '#666', fontSize: '16px' }}>Đang tải sản phẩm...</p>
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
                    <td><strong>#{product.id}</strong></td>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-thumbnail"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{product.name}</strong>
                        {product.isTrial && (
                          <span className="badge-trial" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', background: '#E91E63', color: 'white', borderRadius: '4px' }}>
                            Dùng thử
                          </span>
                        )}
                        {product.isReadyToEat && (
                          <span className="badge-ready" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', background: '#4CAF50', color: 'white', borderRadius: '4px' }}>
                            Ăn liền
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>
                      <strong className="text-success">
                        {product.price.toLocaleString('vi-VN')}đ
                      </strong>
                    </td>
                    <td>
                      <span className={product.stock > 50 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}>
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
                    {imagePreview && (
                      <div style={{ marginBottom: '15px', position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={imagePreview} 
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
                    <div style={{ display: 'flex', gap: '20px' }}>
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
                    </div>
                  </div>
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
