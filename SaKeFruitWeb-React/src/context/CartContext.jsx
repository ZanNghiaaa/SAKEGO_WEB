import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Kiểm tra xem ID có phải MongoDB ObjectId hợp lệ không
const isValidMongoId = (id) => {
  return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Lọc bỏ các item có ID cũ/không hợp lệ (không phải MongoDB ObjectId)
        const validItems = parsed.filter(item => {
          const id = item._id || item.id;
          return isValidMongoId(id);
        });
        // Nếu có item bị lọc bỏ, xóa cart cũ
        if (validItems.length !== parsed.length) {
          console.warn('⚠️ Đã xóa sản phẩm cũ khỏi giỏ hàng (ID không hợp lệ). Vui lòng thêm lại sản phẩm.');
          localStorage.removeItem('cart');
        }
        setCartItems(validItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Normalize: luôn dùng _id từ MongoDB làm key chính
    const normalizedProduct = {
      ...product,
      _id: product._id || product.id,
      id: product._id || product.id,
    };

    // Validate ID trước khi thêm vào giỏ
    if (!isValidMongoId(normalizedProduct._id)) {
      console.error('⚠️ Sản phẩm có ID không hợp lệ, không thể thêm vào giỏ:', normalizedProduct);
      alert('Không thể thêm sản phẩm này vào giỏ hàng. Vui lòng thử lại!');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => (item._id || item.id) === normalizedProduct._id
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item._id || item.id) === normalizedProduct._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...normalizedProduct, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => (item._id || item.id) !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          (item._id || item.id) === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    getItemCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
