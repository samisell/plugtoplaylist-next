import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Use 'true' if your SMTP server uses SSL/TLS, 'false' for STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationLink = `${appUrl}/auth/verify-email?token=${token}&email=${to}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: `Verify your email for ${process.env.SITE_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4a460 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: white; border: 2px solid #d4af37; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code .label { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 10px; }
          .otp-code .code { font-size: 36px; font-weight: bold; color: #d4af37; letter-spacing: 4px; font-family: 'Courier New', monospace; }
          .button-container { text-align: center; margin: 30px 0; }
          .verify-button { background: linear-gradient(135deg, #d4af37 0%, #f4a460 100%); color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; border: none; cursor: pointer; }
          .verify-button:hover { opacity: 0.9; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .divider { margin: 20px 0; text-align: center; color: #ccc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Email Verification</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify your ${process.env.SITE_NAME} account</p>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with <strong>${process.env.SITE_NAME}</strong>. To complete your registration, please verify your email address.</p>
            
            <div class="otp-code">
              <div class="label">Your Verification Code</div>
              <div class="code">${token}</div>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Valid for 1 hour</p>
            </div>
            
            <p style="text-align: center; margin: 20px 0;">Enter this code in your browser or click the button below:</p>
            
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
            </div>
            
            <div class="divider">─ or ─</div>
            
            <p style="word-break: break-all; font-size: 12px; color: #666; background: white; padding: 10px; border-radius: 4px;">
              <strong>If the button doesn't work, copy this link:</strong><br>
              <code>${verificationLink}</code>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              If you did not register for an account, please ignore this email and do not verify your address.
            </p>
            
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Questions? Contact our support team.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/auth/reset-password?token=${token}&email=${to}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: `Password Reset for ${process.env.SITE_NAME}`,
    html: `
      <p>Hello,</p>
      <p>You have requested to reset your password for ${process.env.SITE_NAME}.</p>
      <p>Please click on the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Regards,</p>
      <p>The ${process.env.SITE_NAME} Team</p>
    `,
  });
}

export async function sendContactFormConfirmation(
  to: string,
  name: string,
  subject: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: `We received your message - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4a460 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Message Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We'll get back to you soon</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to ${process.env.SITE_NAME}! We've received your message about <strong>"${subject}"</strong>.</p>
            
            <p style="background: white; padding: 15px; border-left: 4px solid #d4af37; border-radius: 4px;">
              <strong>We typically respond within 24 hours during business hours.</strong><br>
              If your inquiry is urgent, please call us at <strong>${process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+1 (555) 123-4567"}</strong> during support hours.
            </p>
            
            <p style="margin-top: 20px;">Thank you for choosing ${process.env.SITE_NAME}!</p>
            
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Need immediate help? <a href="mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@plugtoplaylist.com"}">Email us directly</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendContactFormNotification(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@plugtoplaylist.com";
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: adminEmail,
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4a460 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; border: 1px solid #ddd; }
          .label { font-weight: bold; color: #d4af37; }
          .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37; margin: 20px 0; white-space: pre-wrap; word-wrap: break-word; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="info-box">
              <div><span class="label">From:</span> ${name}</div>
              <div><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></div>
              <div><span class="label">Subject:</span> ${subject}</div>
            </div>
            
            <div class="message-box">${message}</div>
            
            <p style="text-align: center;">
              <a href="mailto:${email}" style="background: #d4af37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reply to ${name}</a>
            </p>
            
            <div class="footer">
              <p style="margin: 0;">Contact Form Submission System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendGuestSubmissionConfirmation(
  to: string,
  name: string,
  submissionId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const trackingUrl = `${appUrl}/track/${submissionId}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: `🎵 Your Song Submission Received - ${process.env.SITE_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4a460 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .timeline { margin: 25px 0; }
          .timeline-item { display: flex; gap: 15px; margin-bottom: 20px; }
          .timeline-icon { width: 40px; height: 40px; border-radius: 50%; background: #d4af37; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
          .timeline-content h4 { margin: 0 0 5px 0; font-weight: bold; color: #333; }
          .timeline-content p { margin: 0; font-size: 14px; color: #666; }
          .cta-button { background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .cta-button:hover { opacity: 0.9; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .submission-id { background: #fff; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #d4af37; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎵 Song Submitted!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your submission is in good hands</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for submitting your song to <strong>${process.env.SITE_NAME}</strong>! We're excited to review your track.</p>
            
            <div class="info-box">
              <strong>📋 Submission Reference</strong><br>
              <div class="submission-id">${submissionId}</div>
            </div>
            
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-icon">✓</div>
                <div class="timeline-content">
                  <h4>Submission Received</h4>
                  <p>Your song is now in our review queue</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon">⏱</div>
                <div class="timeline-content">
                  <h4>Review (24 Hours)</h4>
                  <p>Our team will review your song and promotion details</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon">💬</div>
                <div class="timeline-content">
                  <h4>Contact You</h4>
                  <p>We'll email you with next steps and promotion options</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon">🚀</div>
                <div class="timeline-content">
                  <h4>Promotion Starts</h4>
                  <p>Your song gets promoted according to your plan</p>
                </div>
              </div>
            </div>
            
            <p style="text-align: center;">
              <a href="https://plugtoplaylist.com" class="cta-button">View Dashboard</a>
            </p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <strong>💡 Next Steps:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Watch for our email (it may take up to 24 hours)</li>
                <li>Choose your promotion plan</li>
                <li>Receive weekly progress reports</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Have questions? <a href="mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@plugtoplaylist.com"}" style="color: #d4af37; text-decoration: none;">Contact our support team</a>
            </p>
            
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Your submission reference: ${submissionId}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}