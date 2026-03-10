import fs from 'fs';
import path from 'path';

// @desc    Upload image to local server
// @route   POST /api/upload/image
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/products/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Upload ảnh thành công!',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Delete file if error occurs
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload ảnh: ' + error.message
    });
  }
};

// @desc    Delete image from local server
// @route   DELETE /api/upload/image/:filename
// @access  Private/Admin
export const deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Tên file không hợp lệ!'
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Xóa ảnh thành công!'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File không tồn tại!'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh: ' + error.message
    });
  }
};
