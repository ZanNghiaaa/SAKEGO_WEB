// API Configuration
const API_URL = 'http://localhost:5000/api';

// Product cache
let productsCache = null;

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fetch products from backend API
export const fetchProductsFromAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    
    // Filter only valid categories (tea, rice-milk, mochi)
    const validCategories = ['tea', 'rice-milk', 'mochi'];
    const filteredProducts = data.products.filter(p => validCategories.includes(p.category));
    
    // Transform API data to match frontend format
    productsCache = filteredProducts.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      category: p.category,
      stock: p.stock,
      isTrial: p.isTrial,
      isReadyToEat: p.isReadyToEat
    }));
    
    return productsCache;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Initialize products
export const initializeProducts = async () => {
  await fetchProductsFromAPI();
};

// Get all products
export const getAllProducts = () => {
  return productsCache || [];
};

// Add new product (via API)
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add product');
    }
    
    const data = await response.json();
    await fetchProductsFromAPI(); // Refresh cache
    return data.product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product (via API)
export const updateProduct = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    
    const data = await response.json();
    await fetchProductsFromAPI(); // Refresh cache
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product (via API)
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    
    await fetchProductsFromAPI(); // Refresh cache
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = (category) => {
  const allProducts = getAllProducts();
  if (category === 'all' || !category) {
    return allProducts;
  }
  return allProducts.filter(p => p.category === category);
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  // Support both string (MongoDB _id) and number (old localStorage id)
  return products.find(p => p.id === id || p.id === parseInt(id) || p.id.toString() === id.toString());
};

// Search products
export const searchProducts = (searchTerm) => {
  const products = getAllProducts();
  const term = searchTerm.toLowerCase().trim();
  return products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
};

// Get product categories with counts
export const getProductCategories = () => {
  const products = getAllProducts();
  const categories = {
    all: { name: 'Tất cả', count: products.length },
    tea: { name: 'Trà Sa Kê', count: 0 },
    'rice-milk': { name: 'Sữa Gạo Sa Kê', count: 0 },
    mochi: { name: 'Bánh Mochi Sa Kê', count: 0 }
  };
  
  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].count++;
    }
  });
  
  return categories;
};

// Initialize on module load - now async
(async () => {
  await initializeProducts();
})();

