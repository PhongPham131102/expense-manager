import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('EMAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendOTPEmail(
    email: string,
    otpCode: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: email,
        subject: 'Mã OTP xác thực - Expense Manager',
        html: this.getOTPTemplate(otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to: ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  private getOTPTemplate(otpCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mã OTP xác thực</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-number { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: monospace; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Mã OTP xác thực</h1>
              <p>Expense Manager</p>
            </div>
            <div class="content">
              <h2>Xin chào!</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Vui lòng nhập mã OTP sau vào ứng dụng:</p>
              <div class="otp-code">
                <div class="otp-number">${otpCode}</div>
              </div>
              <div class="warning">
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul>
                  <li>Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong></li>
                  <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                  <li>Để bảo mật tài khoản, vui lòng không chia sẻ mã OTP này với ai khác</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>Email này được gửi từ hệ thống Expense Manager</p>
              <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
