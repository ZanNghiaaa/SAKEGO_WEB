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
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f7fbfa; }
        .wrapper { padding: 40px 16px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(76, 175, 80, 0.08); border: 1px solid #edf5ee; }
        .header { background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); padding: 48px 32px 36px; text-align: center; position: relative; }
        .header::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 32px; background: #ffffff; border-radius: 32px 32px 0 0; }
        .logo { font-family: 'Quicksand', sans-serif; font-size: 38px; font-weight: 700; color: #ffffff; letter-spacing: 2px; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header-sub { color: rgba(255, 255, 255, 0.95); font-size: 16px; margin: 10px 0 0; font-weight: 500; font-family: 'Quicksand', sans-serif; }
        .badge-success { display: inline-block; background: #ffffff; color: #43a047; border-radius: 30px; padding: 8px 24px; font-size: 14px; font-weight: 700; margin-top: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .content { padding: 32px 40px 40px; }
        .greeting { font-size: 22px; color: #2e7d32; font-weight: 700; margin: 0 0 12px; font-family: 'Quicksand', sans-serif; }
        .intro { color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 32px; }
        .info-card { background: #fdfdfd; border: 1px solid #eef5ef; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .info-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px dashed #e0ebe2; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #777777; font-size: 14px; min-width: 160px; font-weight: 500; }
        .info-value { color: #333333; font-weight: 600; font-size: 14px; }
        .status-pill { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ffa726, #fb8c00); color: #ffffff; border-radius: 30px; padding: 8px 20px; font-weight: 600; font-size: 14px; margin: 0 0 32px; box-shadow: 0 4px 15px rgba(251, 140, 0, 0.2); }
        .section-title { font-size: 18px; font-weight: 700; color: #2e7d32; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; font-family: 'Quicksand', sans-serif; }
        .order-table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1px solid #eef5ef; }
        .order-table thead tr { background: #f3faf4; }
        .order-table thead th { color: #43a047; padding: 14px 16px; text-align: left; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eef5ef; }
        .order-table tbody tr:hover { background: #fafdfb; }
        .total-row { background: #fdfdfd !important; }
        .total-row td { font-weight: 700; font-size: 16px; padding: 20px 16px !important; color: #2e7d32; border-top: 2px solid #eef5ef; }
        .delivery-card { background: #f5faff; border: 1px solid #e3f2fd; border-radius: 16px; padding: 24px; margin-top: 32px; }
        .delivery-card h3 { color: #1976d2; margin: 0 0 16px; font-size: 16px; font-weight: 600; font-family: 'Quicksand', sans-serif; }
        .delivery-item { color: #424242; font-size: 14px; margin: 8px 0; display: flex; align-items: center; gap: 8px; }
        .note-box { background: #fffdf5; border: 1px solid #ffecb3; border-radius: 12px; padding: 20px; margin-top: 24px; color: #f57c00; font-size: 14px; line-height: 1.6; }
        .footer { background: #fafdfb; border-top: 1px solid #eef5ef; padding: 32px 40px; text-align: center; }
        .footer-title { color: #2e7d32; font-weight: 700; font-size: 16px; margin: 0 0 20px; font-family: 'Quicksand', sans-serif; }
        .contact-row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
        .contact-btn { display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #e0ebe2; color: #43a047; text-decoration: none; padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: all 0.3s; }
        .copyright { color: #999999; font-size: 12px; margin: 0; }
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
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7fbfa; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(76, 175, 80, 0.08); border: 1px solid #edf5ee; }
        .header { background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 34px; font-family: 'Quicksand', sans-serif; letter-spacing: 1px; }
        .header h2 { margin: 10px 0 0 0; font-size: 18px; font-weight: 500; opacity: 0.9; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; color: #2e7d32; font-family: 'Quicksand', sans-serif; font-weight: 700; margin-bottom: 24px; }
        .warning-box { background: #fffdf5; border-left: 4px solid #ffa726; padding: 20px; margin: 24px 0; border-radius: 12px; border-top: 1px solid #ffecb3; border-right: 1px solid #ffecb3; border-bottom: 1px solid #ffecb3; color: #e65100; }
        .reset-button { display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); color: white; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; margin: 24px 0; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2); }
        .reset-button:hover { box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3); transform: translateY(-1px); }
        .security-note { background: #fafdfb; padding: 24px; border-radius: 16px; margin: 32px 0 0; font-size: 14px; color: #555555; border: 1px solid #eef5ef; }
        .footer { background: #fafdfb; border-top: 1px solid #eef5ef; text-align: center; padding: 32px; color: #777777; font-size: 14px; }
        .contact-info { margin-top: 16px; line-height: 1.8; }
        .contact-info a { color: #43a047; text-decoration: none; font-weight: 500; }
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
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7fbfa; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(76, 175, 80, 0.08); border: 1px solid #edf5ee; }
        .header { background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 34px; font-family: 'Quicksand', sans-serif; letter-spacing: 1px; }
        .header h2 { margin: 10px 0 0 0; font-size: 18px; font-weight: 500; opacity: 0.9; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; color: #2e7d32; font-family: 'Quicksand', sans-serif; font-weight: 700; margin-bottom: 24px; }
        .password-box { background: #f5faff; border: 2px dashed #90caf9; padding: 32px 24px; margin: 32px 0; border-radius: 16px; text-align: center; }
        .password-box .label { font-size: 13px; color: #555555; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
        .password-box .password { font-size: 36px; font-weight: 800; color: #1976d2; letter-spacing: 6px; margin: 16px 0; font-family: 'Courier New', monospace; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.08); }
        .warning-box { background: #fffdf5; border-left: 4px solid #ffa726; padding: 20px; margin: 24px 0; border-radius: 12px; border: 1px solid #ffecb3; border-left: 4px solid #ffa726; color: #e65100; }
        .info-box { background: #f3faf4; border-left: 4px solid #66bb6a; padding: 20px; margin: 24px 0; border-radius: 12px; border: 1px solid #eef5ef; border-left: 4px solid #66bb6a; color: #2e7d32; }
        .security-note { background: #fafdfb; padding: 24px; border-radius: 16px; margin: 32px 0 0; font-size: 14px; color: #555555; border: 1px solid #eef5ef; }
        .footer { background: #fafdfb; border-top: 1px solid #eef5ef; text-align: center; padding: 32px; color: #777777; font-size: 14px; }
        .contact-info { margin-top: 16px; line-height: 1.8; }
        .contact-info a { color: #43a047; text-decoration: none; font-weight: 500; }
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
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7fbfa; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(76, 175, 80, 0.08); border: 1px solid #edf5ee; }
        .header { background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%); color: white; padding: 48px 20px 40px; text-align: center; }
        .header h1 { margin: 0 0 12px; font-size: 36px; font-family: 'Quicksand', sans-serif; font-weight: 800; letter-spacing: 2px; }
        .header p { margin: 0; opacity: 0.95; font-size: 16px; font-weight: 500; }
        .emoji-big { font-size: 64px; display: block; margin-bottom: 20px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
        .body { padding: 40px; }
        .body h2 { color: #2e7d32; margin: 0 0 16px; font-size: 22px; font-family: 'Quicksand', sans-serif; font-weight: 700; }
        .body p { color: #555555; margin: 0 0 16px; font-size: 15px; }
        .highlight-box { background: #f3faf4; border-left: 4px solid #66bb6a; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #eef5ef; border-left: 4px solid #66bb6a; }
        .highlight-box p { margin: 0; color: #2e7d32; font-weight: 600; font-size: 15px; }
        .order-number { display: inline-block; background: #ffffff; border: 1px solid #c8e6c9; color: #43a047; padding: 6px 16px; border-radius: 30px; font-weight: 700; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .btn-shop { display: inline-block; margin-top: 12px; background: linear-gradient(135deg, #66bb6a, #43a047); color: white; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2); transition: all 0.3s; }
        .btn-shop:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3); }
        .divider { border: none; border-top: 1px dashed #e0ebe2; margin: 32px 0; }
        .feedback { background: #fffdf5; border-radius: 16px; padding: 24px; text-align: center; margin: 32px 0; border: 1px solid #ffecb3; }
        .feedback p { color: #f57c00; font-weight: 600; margin: 0 0 12px; font-size: 15px; }
        .stars { font-size: 28px; letter-spacing: 6px; }
        .footer { background: #fafdfb; padding: 32px; text-align: center; border-top: 1px solid #eef5ef; }
        .footer p { color: #999999; font-size: 13px; margin: 6px 0; }
        .contact-links { margin: 16px 0; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .contact-links a { color: #43a047; text-decoration: none; font-size: 13px; font-weight: 600; background: #ffffff; padding: 8px 16px; border-radius: 20px; border: 1px solid #e0ebe2; }
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
