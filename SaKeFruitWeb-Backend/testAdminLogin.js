const loginAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername: 'admin',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Đăng nhập thành công!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Username:', data.user.username);
      console.log('🔑 Role:', data.user.role);
      console.log('\n🎫 Token (copy và dùng trong frontend):');
      console.log(data.token);
      console.log('\n📝 Để dùng trong frontend, paste vào Console:');
      console.log(`localStorage.setItem('token', '${data.token}');`);
      console.log(`localStorage.setItem('user', '${JSON.stringify(data.user)}');`);
    } else {
      console.log('❌ Đăng nhập thất bại:', data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
};

loginAdmin();
