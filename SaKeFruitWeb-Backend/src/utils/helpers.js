// Helper functions

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Generate random string
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Validate Can Tho district
export const isCanThoDistrict = (district) => {
  const canThoDistricts = [
    'Ninh Kiều',
    'Bình Thủy',
    'Cái Răng',
    'Ô Môn',
    'Thốt Nốt',
    'Phong Điền',
    'Cờ Đỏ',
    'Vĩnh Thạnh',
    'Thới Lai'
  ];
  return canThoDistricts.includes(district);
};

// Paginate results
export const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

// API response helper
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

export const errorResponse = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};
