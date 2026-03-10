import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure env variables are loaded
dotenv.config();

// Create transporter function (lazy initialization)
const getTransporter = () => {
  return nodemailer.createTransport({
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
};

// Send email
export const sendEmail = async (options) => {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `SaKeFruit <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Email templates
export const orderConfirmationEmail = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString('vi-VN')}đ
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        <strong>${(item.price * item.quantity).toLocaleString('vi-VN')}đ</strong>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; }
        .header h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: normal; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .order-info { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #7CB342; }
        .order-info p { margin: 8px 0; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-table th { background: #7CB342; color: white; padding: 12px; text-align: left; }
        .order-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row { background: #f0f7e9; font-size: 18px; font-weight: bold; }
        .status-badge { display: inline-block; padding: 8px 16px; background: #FFC107; color: #333; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .note-box { background: #fff9e6; border: 1px solid #ffd54f; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #f9f9f9; text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .contact-info { margin-top: 15px; }
        .contact-info a { color: #7CB342; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1> SaKeGo </h1>
          <h2>Xác nhận đơn hàng thành công</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Xin chào <strong>${order.customerInfo.fullname}</strong>,</p>
          </div>
          
          <p>Cảm ơn bạn đã đặt hàng tại <strong>SaKeGo</strong>! Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
          
          <div class="order-info">
            <p>📋 <strong>Mã đơn hàng:</strong> ${order.orderNumber}</p>
            <p>📅 <strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            <p>💳 <strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'QR Code'}
            <p>📍 <strong>Địa chỉ giao hàng:</strong> ${order.customerInfo.address}, ${order.customerInfo.district}, TP. Cần Thơ</p>
            <p>📞 <strong>Số điện thoại:</strong> ${order.customerInfo.phone}</p>
          </div>

          <div class="status-badge">
            ⏳ Trạng thái: Đang chờ xử lý
          </div>

          <h3 style="color: #7CB342; margin-top: 30px;">Chi tiết đơn hàng:</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="text-align: center;">Số lượng</th>
                <th style="text-align: right;">Đơn giá</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; padding: 15px;">Tổng cộng:</td>
                <td style="text-align: right; padding: 15px; color: #7CB342;">
                  ${order.totalAmount.toLocaleString('vi-VN')}đ
                </td>
              </tr>
            </tbody>
          </table>

          ${order.customerInfo.notes ? `
          <div class="note-box">
            <strong>📝 Ghi chú của bạn:</strong><br>
            ${order.customerInfo.notes}
          </div>
          ` : ''}

          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #558B2F; margin-top: 0;">🚚 Thông tin giao hàng</h3>
            <p>✅ Đơn hàng sẽ được giao trong vòng <strong>2-3 giờ</strong></p>
            <p>✅ Đối với đơn hàng đặt sau 20h, chúng tôi sẽ giao vào sáng hôm sau</p>
            <p>✅ Nhân viên sẽ liên hệ với bạn trước khi giao hàng</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Cảm ơn bạn đã tin tưởng và ủng hộ SaKeFruit!</strong></p>
          <div class="contact-info">
            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:</p>
            <p>📞 Hotline: <a href="tel:0392020136">039 2020 136</a></p>
            <p>📧 Email: <a href="mailto:support@sakefruit.com">support@sakefruit.com</a></p>
            <p>🌐 Website: <a href="http://localhost:3000">www.sakefruit.com</a></p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2026 SaKeFruit - Trái Sa Kê Tươi Ngon Từ Vườn
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Reset password email template
export const resetPasswordEmail = (fullname, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; }
        .header h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: normal; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .warning-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .reset-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .reset-button:hover { box-shadow: 0 6px 8px rgba(0,0,0,0.15); }
        .security-note { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666; }
        .footer { background: #f9f9f9; text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .contact-info { margin-top: 15px; }
        .contact-info a { color: #7CB342; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1> SaKeFruit</h1>
          <h2>Đặt lại mật khẩu</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Xin chào <strong>${fullname}</strong>,</p>
          </div>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>SaKeFruit</strong>.</p>
          
          <div class="warning-box">
            <strong>⚠️ Lưu ý quan trọng:</strong><br>
            Link đặt lại mật khẩu chỉ có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="reset-button">
              🔒 Đặt lại mật khẩu
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Hoặc copy link sau vào trình duyệt:<br>
            <a href="${resetUrl}" style="color: #7CB342; word-break: break-all;">${resetUrl}</a>
          </p>

          <div class="security-note">
            <strong>🔐 Bảo mật tài khoản:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Không chia sẻ link này với bất kỳ ai</li>
              <li>SaKeFruit không bao giờ yêu cầu mật khẩu qua email hoặc điện thoại</li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy liên hệ ngay với chúng tôi</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Cần hỗ trợ?</strong></p>
          <div class="contact-info">
            <p>📞 Hotline: <a href="tel:0123456789">0123 456 789</a></p>
            <p>📧 Email: <a href="mailto:support@sakefruit.com">support@sakefruit.com</a></p>
            <p>🌐 Website: <a href="http://localhost:3000">www.sakefruit.com</a></p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2026 SaKeFruit - Trái Sa Kê Tươi Ngon Từ Vườn
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Temporary password email template
export const tempPasswordEmail = (fullname, tempPassword) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; }
        .header h2 { margin: 10px 0 0 0; font-size: 20px; font-weight: normal; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .password-box { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 2px dashed #2196F3; padding: 25px; margin: 30px 0; border-radius: 10px; text-align: center; }
        .password-box .label { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .password-box .password { font-size: 32px; font-weight: bold; color: #1976D2; letter-spacing: 5px; margin: 10px 0; font-family: 'Courier New', monospace; background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .warning-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .security-note { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666; }
        .footer { background: #f9f9f9; text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .contact-info { margin-top: 15px; }
        .contact-info a { color: #7CB342; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1> SaKeFruit</h1>
          <h2>Mật khẩu tạm thời</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Xin chào <strong>${fullname}</strong>,</p>
          </div>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>SaKeFruit</strong>.</p>
          
          <p>Dưới đây là <strong>mật khẩu tạm thời</strong> để bạn đăng nhập vào hệ thống:</p>

          <div class="password-box">
            <div class="label">🔑 Mật khẩu tạm thời</div>
            <div class="password">${tempPassword}</div>
            <div style="margin-top: 10px; font-size: 12px; color: #999;">
              (Vui lòng sao chép chính xác)
            </div>
          </div>

          <div class="info-box">
            <strong>📋 Hướng dẫn đăng nhập:</strong>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Truy cập trang đăng nhập SaKeFruit</li>
              <li>Nhập email của bạn</li>
              <li>Nhập mật khẩu tạm thời ở trên</li>
              <li>Sau khi đăng nhập, vào <strong>Tài khoản</strong> → <strong>Đổi mật khẩu</strong></li>
            </ol>
          </div>

          <div class="warning-box">
            <strong>⚠️ Lưu ý quan trọng:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Mật khẩu này là <strong>tạm thời</strong> - bạn nên đổi mật khẩu mới sau khi đăng nhập</li>
              <li>Không chia sẻ mật khẩu này với bất kỳ ai</li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy liên hệ ngay với chúng tôi</li>
            </ul>
          </div>

          <div class="security-note">
            <strong>🔐 Bảo mật tài khoản:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>SaKeFruit không bao giờ yêu cầu mật khẩu qua điện thoại</li>
              <li>Đổi mật khẩu thường xuyên để bảo vệ tài khoản</li>
              <li>Sử dụng mật khẩu mạnh: 8+ ký tự, có chữ hoa, chữ thường, số</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Cần hỗ trợ?</strong></p>
          <div class="contact-info">
            <p>📞 Hotline: <a href="tel:0123456789">0123 456 789</a></p>
            <p>📧 Email: <a href="mailto:support@sakefruit.com">support@sakefruit.com</a></p>
            <p>🌐 Website: <a href="http://localhost:3000">www.sakefruit.com</a></p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2026 SaKeFruit - Trái Sa Kê Tươi Ngon Từ Vườn
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
