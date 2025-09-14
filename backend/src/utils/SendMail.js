const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const sendResetMail = async (email, resetToken, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.pass,
      },
    });

    const mailOptions = {
      from: config.nodemailer.email,
      to: email,
      subject: 'Password Reset Request',
      html: `
                <h2>Password Reset</h2>
                <p>You requested for a password reset. Click the link below to reset your password. This link is valid for 10 minutes.</p>
                <a href="${config.FRONTEND_API_LINK}/${type}/update-password/${resetToken}" target="_blank">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Reset email sent successfully');
  } catch (error) {
    logger.error('Error sending reset email:', error);
    throw new Error('Could not send reset email');
  }
};

module.exports = sendResetMail;
