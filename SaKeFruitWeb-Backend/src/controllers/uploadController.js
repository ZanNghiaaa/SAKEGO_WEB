import fs from 'fs';
import uploadService from '../services/UploadService.js';

// @desc    Upload image to local server
// @route   POST /api/upload/image
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    const result = uploadService.uploadImage(req.file);

    res.json({
      success: true,
      message: 'Upload ảnh thành công!',
      ...result
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Delete file if error occurs
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message === 'Vui lòng chọn file ảnh để upload') {
      return res.status(400).json({ success: false, message: error.message });
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
    uploadService.deleteImage(req.params.filename);
    
    res.json({
      success: true,
      message: 'Xóa ảnh thành công!'
    });
  } catch (error) {
    console.error('Delete error:', error);
    if (error.message === 'Tên file không hợp lệ!') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === 'File không tồn tại!') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh: ' + error.message
    });
  }
};
