import { Resend } from 'resend';
import dotenv from 'dotenv';

// Ensure env variables are loaded
dotenv.config();

// Create resend client (lazy initialization)
let resendClient = null;
const getResendClient = () => {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

// Send email
export const sendEmail = async (options) => {
  const resend = getResendClient();

  if (!resend) {
    console.error('Error: RESEND_API_KEY is not configured');
    return;
  }

  try {
    const data = await resend.emails.send({
      from: 'Sakego <noreply@sakego.com.vn>',
      to: options.email,
      subject: options.subject,
      html: options.html
    });
    console.log('Email sent successfully via Resend:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Email templates
export const orderConfirmationEmail = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; color: #333; font-weight: 600;">
        ${item.name}
      </td>
      <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #666;">
        x${item.quantity}
      </td>
      <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #666;">
        ${item.price.toLocaleString('vi-VN')}đ
      </td>
      <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #2e7d32; font-weight: 700;">
        ${(item.price * item.quantity).toLocaleString('vi-VN')}đ
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); }
        .wrapper { padding: 32px 16px; }
        .container { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(46,125,50,0.12); }
        .header { background: linear-gradient(135deg, #00C853 0%, #1B5E20 100%); padding: 40px 32px 32px; text-align: center; position: relative; }
        .header::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 30px; background: #fff; border-radius: 30px 30px 0 0; }
        .logo { font-size: 34px; font-weight: 800; color: #fff; letter-spacing: 3px; margin: 0; text-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .header-sub { color: rgba(255,255,255,0.92); font-size: 15px; margin: 8px 0 0; font-weight: 500; }
        .badge-success { display: inline-block; background: rgba(255,255,255,0.22); border: 2px solid rgba(255,255,255,0.5); color: #fff; border-radius: 30px; padding: 6px 18px; font-size: 13px; font-weight: 700; margin-top: 12px; letter-spacing: 1px; }
        .content { padding: 32px 32px 24px; }
        .greeting { font-size: 18px; color: #1B5E20; font-weight: 700; margin: 0 0 8px; }
        .intro { color: #555; font-size: 14px; line-height: 1.7; margin: 0 0 24px; }
        .info-card { background: linear-gradient(135deg, #f0fff4 0%, #e8f5e9 100%); border: 1px solid #c8e6c9; border-radius: 14px; padding: 22px 24px; margin-bottom: 24px; }
        .info-row { display: flex; align-items: center; padding: 7px 0; border-bottom: 1px dashed #c8e6c9; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #555; font-size: 13px; min-width: 170px; }
        .info-value { color: #1B5E20; font-weight: 700; font-size: 13px; }
        .status-pill { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(90deg, #FF6F00, #FFA000); color: #fff; border-radius: 30px; padding: 8px 20px; font-weight: 700; font-size: 14px; margin: 4px 0 24px; box-shadow: 0 4px 12px rgba(255,111,0,0.3); }
        .section-title { font-size: 15px; font-weight: 700; color: #1B5E20; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
        .order-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e8f5e9; }
        .order-table thead tr { background: linear-gradient(90deg, #43A047, #2E7D32); }
        .order-table thead th { color: #fff; padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; }
        .order-table tbody tr:hover { background: #f9fff9; }
        .total-row { background: linear-gradient(90deg, #E8F5E9, #F1F8E9) !important; }
        .total-row td { font-weight: 700; font-size: 16px; padding: 16px !important; color: #1B5E20; border-top: 2px solid #A5D6A7; }
        .delivery-card { background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border: 1px solid #90CAF9; border-radius: 14px; padding: 20px 24px; margin-top: 20px; }
        .delivery-card h3 { color: #1565C0; margin: 0 0 12px; font-size: 14px; font-weight: 700; }
        .delivery-item { color: #1976D2; font-size: 13px; margin: 6px 0; display: flex; align-items: center; gap: 8px; }
        .note-box { background: linear-gradient(135deg, #FFF8E1, #FFF3CD); border: 1px solid #FFD54F; border-radius: 12px; padding: 16px 20px; margin-top: 16px; color: #E65100; font-size: 13px; }
        .footer { background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 28px 32px; text-align: center; }
        .footer-title { color: #fff; font-weight: 700; font-size: 15px; margin: 0 0 16px; }
        .contact-row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .contact-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .copyright { color: rgba(255,255,255,0.5); font-size: 11px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <p class="logo">&#127807; SAKEGO</p>
            <p class="header-sub">Trái Sa Kê Tươi Ngon Từ Vườn</p>
            <span class="badge-success">&#10003; Đơn hàng đã xác nhận</span>
          </div>

          <div class="content">
            <p class="greeting">Xin chào ${order.customerInfo.fullname}! 👋</p>
            <p class="intro">Cảm ơn bạn đã đặt hàng tại <strong>SAKEGO</strong>! Đơn hàng của bạn đã được xác nhận và chúng tôi đang chuẩn bị gửi ngay cho bạn nhé! 🌿</p>

            <div class="info-card">
              <div class="info-row">
                <span class="info-label">📋 Mã đơn hàng</span>
                <span class="info-value">${order.orderNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📅 Ngày đặt</span>
                <span class="info-value">${new Date(order.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">💳 Thanh toán</span>
                <span class="info-value">${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'QR Code'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📍 Địa chỉ giao hàng</span>
                <span class="info-value">${order.customerInfo.address}, ${order.customerInfo.district}, TP. Cần Thơ</span>
              </div>
              <div class="info-row">
                <span class="info-label">📞 Số điện thoại</span>
                <span class="info-value">${order.customerInfo.phone}</span>
              </div>
            </div>

            <div class="status-pill">⏳ Đang chờ xử lý</div>

            <p class="section-title">🛒 Chi tiết đơn hàng</p>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th style="text-align:center">Số lượng</th>
                  <th style="text-align:right">Đơn giá</th>
                  <th style="text-align:right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="text-align:right; padding: 16px;">Tổng cộng:</td>
                  <td style="text-align:right; padding: 16px; color: #E53935; font-size: 18px;">${order.totalAmount.toLocaleString('vi-VN')}đ</td>
                </tr>
              </tbody>
            </table>

            ${order.customerInfo.notes ? `
            <div class="note-box">
              <strong>📝 Ghi chú của bạn:</strong><br>
              ${order.customerInfo.notes}
            </div>
            ` : ''}

            <div class="delivery-card">
              <h3>🚚 Thông tin giao hàng</h3>
              <div class="delivery-item">✅ Đơn hàng sẽ được giao trong vòng <strong>&nbsp;2-3 giờ</strong></div>
              <div class="delivery-item">✅ Đơn hàng sau 20h sẽ được giao vào sáng hôm sau</div>
              <div class="delivery-item">✅ Nhân viên sẽ liên hệ trước khi giao hàng</div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-title">💚 Cảm ơn bạn đã tin tưởng SAKEGO!</p>
            <div class="contact-row">
              <a href="tel:0392020136" class="contact-btn">📞 039 2020 136</a>
              <a href="mailto:Sakego25@gmail.com" class="contact-btn">📧 Sakego25@gmail.com</a>
              <a href="https://www.sakego.com.vn" class="contact-btn">🌐 sakego.com.vn</a>
            </div>
            <p class="copyright">© 2026 SAKEGO - Trái Sa Kê Tươi Ngon Từ Vườn</p>
          </div>
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
          <h1> SaKeGo</h1>
          <h2>Đặt lại mật khẩu</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Xin chào <strong>${fullname}</strong>,</p>
          </div>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>SaKeGo</strong>.</p>
          
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
              <li>SaKeGo không bao giờ yêu cầu mật khẩu qua email hoặc điện thoại</li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy liên hệ ngay với chúng tôi</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Cần hỗ trợ?</strong></p>
          <div class="contact-info">
            <p>📞 Hotline: <a href="tel:0123456789">0123 456 789</a></p>
            <p>📧 Email: <a href="mailto:Sakego25@gmail.com">Sakego25@gmail.com</a></p>
            <p>🌐 Website: <a href="http://localhost:3000">www.SaKeGo.com</a></p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2026 SaKeGo - Trái Sa Kê Tươi Ngon Từ Vườn
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
          <h1> SaKeGo</h1>
          <h2>Mật khẩu tạm thời</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Xin chào <strong>${fullname}</strong>,</p>
          </div>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>SaKeGo</strong>.</p>
          
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
              <li>Truy cập trang đăng nhập SaKeGo</li>
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
              <li>SaKeGo không bao giờ yêu cầu mật khẩu qua điện thoại</li>
              <li>Đổi mật khẩu thường xuyên để bảo vệ tài khoản</li>
              <li>Sử dụng mật khẩu mạnh: 8+ ký tự, có chữ hoa, chữ thường, số</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Cần hỗ trợ?</strong></p>
          <div class="contact-info">
            <p>📞 Hotline: <a href="tel:0123456789">0123 456 789</a></p>
            <p>📧 Email: <a href="mailto:support@SaKeGo.com">support@SaKeGo.com</a></p>
            <p>🌐 Website: <a href="http://localhost:3000">www.SaKeGo.com</a></p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2026 SaKeGo - Trái Sa Kê Tươi Ngon Từ Vườn
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Thank you email after delivery completed
export const thankYouEmail = (order) => {
  const customerName = order.userId?.fullname || order.customerInfo?.fullname || 'Quý khách';
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7CB342 0%, #558B2F 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0 0 8px; font-size: 28px; font-weight: 800; letter-spacing: 1px; }
        .header p { margin: 0; opacity: 0.9; font-size: 15px; }
        .emoji-big { font-size: 60px; display: block; margin-bottom: 16px; }
        .body { padding: 36px 32px; }
        .body h2 { color: #2e7d32; margin: 0 0 12px; font-size: 20px; }
        .body p { color: #555; margin: 0 0 14px; }
        .highlight-box { background: #f1f8e9; border-left: 4px solid #7CB342; border-radius: 8px; padding: 18px 20px; margin: 24px 0; }
        .highlight-box p { margin: 0; color: #33691e; font-weight: 600; font-size: 15px; }
        .order-number { display: inline-block; background: #e8f5e9; border: 1px solid #a5d6a7; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 14px; }
        .btn-shop { display: inline-block; margin-top: 8px; background: linear-gradient(135deg, #7CB342, #558B2F); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; }
        .divider { border: none; border-top: 1px solid #eee; margin: 28px 0; }
        .feedback { background: #fff8e1; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .feedback p { color: #f57f17; font-weight: 600; margin: 0 0 8px; }
        .stars { font-size: 24px; letter-spacing: 4px; }
        .footer { background: #f9f9f9; padding: 20px 32px; text-align: center; border-top: 1px solid #eee; }
        .footer p { color: #999; font-size: 12px; margin: 4px 0; }
        .contact-links a { color: #7CB342; text-decoration: none; margin: 0 8px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="emoji-big">🎉</span>
          <h1>SAKEGO</h1>
          <p>Giao hàng thành công - Cảm ơn bạn!</p>
        </div>
        <div class="body">
          <h2>Xin chào ${customerName},</h2>
          <p>Chúng tôi rất vui khi đơn hàng của bạn đã được giao thành công! Hy vọng bạn đã hài lòng với sản phẩm Sa Kê tươi ngon từ vườn của chúng tôi 🌿</p>

          <div class="highlight-box">
            <p>📦 Đơn hàng <span class="order-number">#${String(order.orderNumber).slice(-6).toUpperCase()}</span> đã được giao thành công!</p>
          </div>

          <p>Sa Kê là loại trái cây đặc biệt, giàu dinh dưỡng và hương vị độc đáo. Chúng tôi hy vọng bạn và gia đình sẽ thưởng thức thật ngon miệng!</p>

          <div class="feedback">
            <p>⭐ Bạn có hài lòng với đơn hàng không?</p>
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p style="font-size: 12px; color: #aaa; margin-top: 8px;">Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn!</p>
          </div>

          <hr class="divider">

          <p style="text-align:center"><strong>Muốn đặt thêm? Ghé thăm chúng tôi ngay!</strong></p>
          <p style="text-align:center">
            <a class="btn-shop" href="https://www.sakego.com.vn/products">🛒 Mua sắm tiếp</a>
          </p>
        </div>
        <div class="footer">
          <p><strong>Cảm ơn bạn đã tin tưởng SAKEGO! 💚</strong></p>
          <div class="contact-links">
            <a href="mailto:Sakego25@gmail.com">📧 Sakego25@gmail.com</a>
            <a href="tel:0392020136">📞 039 2020 136</a>
            <a href="https://www.sakego.com.vn">🌐 sakego.com.vn</a>
          </div>
          <p style="margin-top: 12px; color: #bbb; font-size: 11px;">© 2026 SAKEGO - Trái Sa Kê Tươi Ngon Từ Vườn</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
