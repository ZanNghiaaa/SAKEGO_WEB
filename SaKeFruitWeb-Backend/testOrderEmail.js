import dotenv from 'dotenv';
import { sendEmail, orderConfirmationEmail } from './src/utils/email.js';

dotenv.config();

// Mock order data for testing
const mockOrder = {
  orderNumber: 'SO-TEST123',
  customerInfo: {
    fullname: 'Nghĩa Test',
    email: 'vannghia.170320@gmail.com',
    phone: '0123456789',
    address: '123 Đường Test',
    district: 'Ninh Kiều'
  },
  items: [
    {
      name: 'Sa Kê Siêu Ngon',
      quantity: 2,
      price: 50000
    },
    {
      name: 'Sa Kê VIP',
      quantity: 1,
      price: 80000
    }
  ],
  totalAmount: 180000,
  paymentMethod: 'cod',
  createdAt: new Date()
};

const testOrderEmail = async () => {
  console.log('📧 Testing Order Confirmation Email...\n');
  console.log('Sending to:', mockOrder.customerInfo.email);
  console.log('Order Number:', mockOrder.orderNumber);
  console.log('Total Amount:', mockOrder.totalAmount.toLocaleString('vi-VN'), 'đ');
  console.log('');
  
  try {
    await sendEmail({
      email: mockOrder.customerInfo.email,
      subject: '✅ Xác nhận đơn hàng - SaKeFruit',
      html: orderConfirmationEmail(mockOrder)
    });
    
    console.log('✅ Order confirmation email sent successfully!');
    console.log('📬 Please check your email:', mockOrder.customerInfo.email);
    console.log('⚠️  If you don\'t see it, check your SPAM folder!');
  } catch (error) {
    console.error('❌ Error sending order email:', error.message);
  }
};

testOrderEmail();
