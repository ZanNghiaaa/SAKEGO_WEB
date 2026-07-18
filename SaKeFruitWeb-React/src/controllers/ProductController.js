const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache data to avoid fetching too often
let cachedProducts = null;
let lastFetchTime = null;
const CACHE_DURATION = 60000; // 1 minute

// Helper: Normalize product data from MongoDB
const normalizeProduct = (product) => ({
  ...product,
  id: product._id?.toString() || product.id,
  _id: product._id?.toString() || product.id,
});

// Lấy toàn bộ sản phẩm từ API
export const fetchProductsFromAPI = async (forceRefresh = false) => {
  try {
    // Check cache
    if (!forceRefresh && cachedProducts && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return cachedProducts;
    }

    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    
    if (data.success && data.products) {
      cachedProducts = data.products.map(normalizeProduct);
      lastFetchTime = Date.now();
      return cachedProducts;
    }
    
    return cachedProducts || [];
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm từ API:', error);
    return cachedProducts || [];
  }
};

// Sử dụng cache cho getAllProducts
export const getAllProducts = () => {
  return cachedProducts || [];
};

export const getProductsByCategory = (category) => {
  const products = cachedProducts || [];
  if (category === 'all' || !category) {
    return products;
  }
  return products.filter(p => p.category === category);
};

export const getProductById = (id) => {
  const products = cachedProducts || [];
  return products.find(p => p.id === id || p._id === id);
};

export const searchProducts = (searchTerm) => {
  const products = cachedProducts || [];
  const term = searchTerm.toLowerCase().trim();
  return products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    (p.description && p.description.toLowerCase().includes(term))
  );
};

export const getProductCategories = () => {
  const products = cachedProducts || [];
  const categories = {
    all: { name: 'Tất cả', count: products.length },
    tea: { name: 'Trà Sa Kê', count: 0 },
    'rice-milk': { name: 'Sữa Gạo', count: 0 },
    mochi: { name: 'Bánh Mochi', count: 0 },
    combo: { name: 'Combo', count: 0 }
  };
  
  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].count++;
    }
  });
  
  return categories;
};

// Admin Functions
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token 
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

export const addProduct = async (productData) => {
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(productData)
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Thêm sản phẩm thất bại!');
    
    await fetchProductsFromAPI(true); // Force refresh cache
    return data.product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates)
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Cập nhật sản phẩm thất bại!');
    
    await fetchProductsFromAPI(true); // Force refresh cache
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Xóa sản phẩm thất bại!');
    
    await fetchProductsFromAPI(true); // Force refresh cache
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
