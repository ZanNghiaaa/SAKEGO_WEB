import userRepository from '../repositories/UserRepository.js';

class UserService {
  async getAllUsers() {
    return await userRepository.findAll({}, { sort: { createdAt: -1 } });
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    return user;
  }

  async updateProfile(id, profileData) {
    const user = await userRepository.findById(id);
    
    if (!user) {
      throw new Error('Người dùng không tồn tại!');
    }
    
    const { fullname, phone, address } = profileData;
    
    // Update fields
    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    await userRepository.save(user);
    return user;
  }

  async changePassword(id, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(id);
    
    if (!user) {
      throw new Error('Người dùng không tồn tại!');
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không đúng!');
    }
    
    // Update password
    user.password = newPassword;
    await userRepository.save(user);
    
    return true;
  }
}

export default new UserService();
