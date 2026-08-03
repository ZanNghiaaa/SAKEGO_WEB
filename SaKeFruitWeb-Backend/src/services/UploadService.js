import fs from 'fs';
import path from 'path';

class UploadService {
  uploadImage(file) {
    if (!file) {
      throw new Error('Vui lòng chọn file ảnh để upload');
    }
    
    // Generate URL for the uploaded file
    const fileUrl = `/uploads/products/${file.filename}`;
    
    return {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    };
  }

  deleteImage(filename) {
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Tên file không hợp lệ!');
    }

    const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    } else {
      throw new Error('File không tồn tại!');
    }
  }
}

export default new UploadService();
