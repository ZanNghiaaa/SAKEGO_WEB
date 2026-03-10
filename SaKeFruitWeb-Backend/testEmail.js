import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmail = async () => {
  console.log('📧 Testing Email Configuration...\n');
  
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('');
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  try {
    // Verify connection
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Send test email
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: `SaKeFruit <${process.env.EMAIL_USER}>`,
      to: 'vannghia.170320@gmail.com', // Email người nhận
      subject: 'Test Email - SaKeFruit',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7CB342;">🍊 Test Email từ SaKeFruit</h1>
          <p>Đây là email test để kiểm tra cấu hình gửi email.</p>
          <p>Nếu bạn nhận được email này, nghĩa là hệ thống email đã hoạt động đúng!</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Thời gian gửi: ${new Date().toLocaleString('vi-VN')}<br>
            Server: ${process.env.EMAIL_HOST}
          </p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 Email configuration is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
};

testEmail();
