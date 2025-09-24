const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const sendResetMail = async (email, resetId, userType) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.pass,
      },
    });

    const resetUrl = `${config.frontendApiLink}/auth/reset-password/${userType}/${resetId}`;

    const mailOptions = {
      from: `College Management System <${config.nodemailer.email}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // In non-production environments, log the email instead of sending it
    if (process.env.NODE_ENV !== 'production') {
      logger.info('--- FAKE EMAIL SENT ---');
      logger.info(`To: ${email}`);
      logger.info(`Subject: ${mailOptions.subject}`);
      logger.info(`Reset URL: ${resetUrl}`);
      logger.info('-----------------------');
      return;
    }

    await transporter.sendMail(mailOptions);
    logger.info(`Reset email sent successfully to ${email}`);
  } catch (error) {
    logger.error('Error sending reset email:', error);
    throw new Error('Could not send reset email');
  }
};

module.exports = sendResetMail;
