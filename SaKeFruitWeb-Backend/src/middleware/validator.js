import { body, validationResult } from 'express-validator';

// Validate request
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for registration
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail({ gmail_remove_dots: false })
    .toLowerCase(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('fullname')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc')
    .trim(),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ')
];

// Validation rules for login
export const loginValidation = [
  body('emailOrUsername')
    .notEmpty()
    .withMessage('Email hoặc tên đăng nhập là bắt buộc'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
];

// Validation rules for product
export const productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Tên sản phẩm là bắt buộc')
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Giá phải là số')
    .isFloat({ min: 0 })
    .withMessage('Giá không thể âm'),
  body('description')
    .notEmpty()
    .withMessage('Mô tả là bắt buộc'),
  body('category')
    .isIn(['tea', 'rice-milk', 'mochi'])
    .withMessage('Danh mục không hợp lệ'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng không hợp lệ')
];

// Validation rules for order
export const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('customerInfo.fullname')
    .notEmpty()
    .withMessage('Họ tên là bắt buộc'),
  body('customerInfo.email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('customerInfo.phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('customerInfo.address')
    .notEmpty()
    .withMessage('Địa chỉ là bắt buộc'),
  body('customerInfo.district')
    .notEmpty()
    .withMessage('Quận/Huyện là bắt buộc')
];
