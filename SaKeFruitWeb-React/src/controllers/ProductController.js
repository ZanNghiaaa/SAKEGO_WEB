// Mock addProduct: chỉ alert và resolve
export const addProduct = async (productData) => {
  alert('Chức năng này chỉ demo: Không thể thêm sản phẩm ở chế độ dữ liệu cứng!');
  return Promise.resolve();
};

// Mock updateProduct: chỉ alert và resolve
export const updateProduct = async (id, updates) => {
  alert('Chức năng này chỉ demo: Không thể sửa sản phẩm ở chế độ dữ liệu cứng!');
  return Promise.resolve();
};

// Mock deleteProduct: chỉ alert và resolve
export const deleteProduct = async (id) => {
  alert('Chức năng này chỉ demo: Không thể xóa sản phẩm ở chế độ dữ liệu cứng!');
  return Promise.resolve();
};
import sampleProducts from '../sampleProducts';

// Lấy toàn bộ sản phẩm (dữ liệu cứng)
export const fetchProductsFromAPI = async () => {
  return sampleProducts;
};

export const initializeProducts = async () => {
  // Không cần làm gì vì dữ liệu đã cứng
  return;
};

export const getAllProducts = () => {
  return sampleProducts;
};

export const getProductsByCategory = (category) => {
  if (category === 'all' || !category) {
    return sampleProducts;
  }
  return sampleProducts.filter(p => p.category === category);
};

export const getProductById = (id) => {
  // Tìm theo id (chuẩn route /product/:id)
  return sampleProducts.find(p => p.id === id);
};

export const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  return sampleProducts.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
};

export const getProductCategories = () => {
  const categories = {
    all: { name: 'Tất cả', count: sampleProducts.length },
    tea: { name: 'Trà Sa Kê', count: 0 },
    'rice-milk': { name: 'Sữa Gạo', count: 0 },
    mochi: { name: 'Bánh Mochi', count: 0 },
    combo: { name: 'Combo', count: 0 }
  };
  sampleProducts.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].count++;
    }
  });
  return categories;
};
