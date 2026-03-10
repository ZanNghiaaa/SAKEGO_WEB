import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('=== DEBUG EMAIL CONFIGURATION ===\n');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
console.log('EMAIL_PASS value:', process.env.EMAIL_PASS);
console.log('\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('Transporter auth:', transporter.options.auth);

const sendTestEmail = async () => {
  try {
    console.log('\n⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: `SaKeFruit <${process.env.EMAIL_USER}>`,
      to: 'vannghia.170320@gmail.com',
      subject: 'Test Email - Debug',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
    });
    
    console.log('✅ Email sent!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  }
};

sendTestEmail();
