// User data and authentication controller
const API_URL = 'http://localhost:5000/api';
const USERS_KEY = 'sakefruit_users';
const CURRENT_USER_KEY = 'sakefruit_current_user';
const TOKEN_KEY = 'token';

// Default users from HTML mockData
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    fullname: 'Quản trị viên',
    email: 'admin@sakefruit.com',
    phone: '0987654321',
    address: '',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    username: 'user01',
    password: 'user123',
    fullname: 'Nguyễn Văn A',
    email: 'user01@gmail.com',
    phone: '0123456789',
    address: 'TP. Hồ Chí Minh',
    role: 'customer',
    createdAt: '2024-01-15'
  }
];

// Initialize users in localStorage if not exists
export const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Get all users
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : defaultUsers;
};

// Get user by email or username
export const getUserByCredentials = (emailOrUsername) => {
  const users = getUsers();
  return users.find(u => 
    u.email === emailOrUsername || u.username === emailOrUsername
  );
};

// Register new user via API
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Đăng ký thất bại!');
    }

    return data.user;
  } catch (error) {
    throw new Error(error.message || 'Không thể kết nối đến server!');
  }
};

// Register new user (old - localStorage)
export const registerUserLocal = (userData) => {
  const users = getUsers();
  
  // Check if email or username already exists
  const existingUser = users.find(u => 
    u.email === userData.email || u.username === userData.username
  );
  
  if (existingUser) {
    throw new Error('Email hoặc tên đăng nhập đã tồn tại!');
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username: userData.email.split('@')[0], // Generate username from email
    password: userData.password,
    fullname: userData.fullname,
    email: userData.email,
    phone: userData.phone,
    address: userData.address || '',
    role: 'customer',
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return newUser;
};

// Login user via API
export const loginUser = async (emailOrUsername, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername,
        password
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Đăng nhập thất bại!');
    }

    // Lưu token và user info vào localStorage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

    // Dispatch custom event to notify components about auth state change
    window.dispatchEvent(new Event('authStateChanged'));

    return data.user;
  } catch (error) {
    throw new Error(error.message || 'Không thể kết nối đến server!');
  }
};

// Login user (old - for backward compatibility)
export const loginUserLocal = (emailOrUsername, password) => {
  const user = getUserByCredentials(emailOrUsername);
  
  if (!user) {
    throw new Error('Tài khoản không tồn tại!');
  }
  
  if (user.password !== password) {
    throw new Error('Mật khẩu không đúng!');
  }
  
  // Save current user (without password)
  const currentUser = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  
  // Dispatch custom event to notify components about auth state change
  window.dispatchEvent(new Event('authStateChanged'));
  
  return currentUser;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  
  // Dispatch custom event to notify components about auth state change
  window.dispatchEvent(new Event('authStateChanged'));
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Update user profile
export const updateUserProfile = (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Người dùng không tồn tại!');
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: userId, // Prevent ID change
    role: users[userIndex].role // Prevent role change
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedCurrentUser = {
      ...currentUser,
      ...updates
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));
  }
  
  return users[userIndex];
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Check if current user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Check if current user is customer
export const isCustomer = () => {
  const user = getCurrentUser();
  return user && user.role === 'customer';
};

// Get user's order history (placeholder for future implementation)
export const getUserOrders = (userId) => {
  // This would connect to an orders system in the future
  return [];
};

// Initialize on module load
initializeUsers();
