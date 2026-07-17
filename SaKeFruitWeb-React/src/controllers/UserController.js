// ============================================================
// UserController.js
// Gọi backend API thật thay vì dùng localStorage
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'sakefruit_current_user';
const TOKEN_KEY = 'token';

// -------------------------------------------------------
// Auth
// -------------------------------------------------------

// Đăng ký tài khoản mới
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      fullname: userData.fullname,
      phone: userData.phone,
      address: userData.address || ''
    })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Đăng ký thất bại!');

  // Lưu token và thông tin user
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event('authStateChanged'));
  return data.user;
};

// Đăng nhập
export const loginUser = async (emailOrUsername, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Đăng nhập thất bại!');

  // Lưu token và thông tin user
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event('authStateChanged'));
  return data.user;
};

// Đăng xuất
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event('authStateChanged'));
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Gửi email thất bại!');
  return data;
};

// -------------------------------------------------------
// Getters
// -------------------------------------------------------

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isLoggedIn = () => getCurrentUser() !== null;

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isCustomer = () => {
  const user = getCurrentUser();
  return user && user.role === 'customer';
};

// -------------------------------------------------------
// Update profile
// -------------------------------------------------------
export const updateUserProfile = async (userId, updates) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Cập nhật thất bại!');

  // Update localStorage
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updated = { ...currentUser, ...data.user };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  }
  return data.user;
};

// -------------------------------------------------------
// Backward compat (legacy functions)
// -------------------------------------------------------
export const initializeUsers = () => {}; // No-op (API handles this)
export const getUsers = () => []; // Not needed on frontend
export const getUserByCredentials = () => null;
export const registerUserLocal = () => { throw new Error('Use registerUser instead'); };
export const loginUserLocal = () => { throw new Error('Use loginUser instead'); };
export const getUserOrders = () => [];
