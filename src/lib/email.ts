import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, SITE_NAME } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"${SITE_NAME}" <${ADMIN_EMAIL}>`,
      ...options,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// --- Email Templates ---

// 1. Admin Notification: New User Registration
export const sendNewUserAdminNotification = async (userEmail: string) => {
  await sendEmail({
    to: ADMIN_EMAIL!,
    subject: `[${SITE_NAME}] New User Registration`,
    text: `A new user has registered with the email: ${userEmail}`,
    html: `<p>A new user has registered with the email: <strong>${userEmail}</strong></p>`,
  });
};

// 2. User Notification: Welcome Email
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  await sendEmail({
    to: userEmail,
    subject: `Welcome to ${SITE_NAME}!`,
    text: `Hi ${userName},\n\nWelcome to ${SITE_NAME}! We're excited to have you on board.`,
    html: `<p>Hi ${userName},</p><p>Welcome to ${SITE_NAME}! We're excited to have you on board.</p>`,
  });
};

// 3. Admin Notification: New Submission
export const sendNewSubmissionAdminNotification = async (submissionId: string, trackUrl: string) => {
  await sendEmail({
    to: ADMIN_EMAIL!,
    subject: `[${SITE_NAME}] New Submission Received`,
    text: `A new submission has been received.\n\nSubmission ID: ${submissionId}\nTrack URL: ${trackUrl}`,
    html: `<p>A new submission has been received.</p><ul><li>Submission ID: ${submissionId}</li><li>Track URL: <a href="${trackUrl}">${trackUrl}</a></li></ul>`,
  });
};

// 4. User Notification: Submission Confirmation
export const sendSubmissionConfirmationEmail = async (userEmail: string, submissionId: string) => {
  await sendEmail({
    to: userEmail,
    subject: `Your Submission to ${SITE_NAME} is Confirmed`,
    text: `Thank you for your submission! Your submission ID is ${submissionId}. We will review it shortly.`,
    html: `<p>Thank you for your submission! Your submission ID is <strong>${submissionId}</strong>. We will review it shortly.</p>`,
  });
};

// 5. Admin Notification: New Payment
export const sendNewPaymentAdminNotification = async (paymentId: string, amount: number, currency: string) => {
  await sendEmail({
    to: ADMIN_EMAIL!,
    subject: `[${SITE_NAME}] New Payment Received`,
    text: `A new payment of ${amount} ${currency} has been received. Payment ID: ${paymentId}`,
    html: `<p>A new payment of <strong>${amount} ${currency}</strong> has been received.</p><p>Payment ID: ${paymentId}</p>`,
  });
};

// 6. User Notification: Payment Confirmation
export const sendPaymentConfirmationEmail = async (userEmail: string, amount: number, currency: string) => {
  await sendEmail({
    to: userEmail,
    subject: `Your Payment to ${SITE_NAME} was Successful`,
    text: `Thank you for your payment of ${amount} ${currency}. Your order is being processed.`,
    html: `<p>Thank you for your payment of <strong>${amount} ${currency}</strong>. Your order is being processed.</p>`,
  });
};