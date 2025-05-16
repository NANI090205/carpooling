require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send mail with HTML and text support, plus optional CC/BCC.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text content.
 * @param {string} html - Optional HTML content.
 * @param {string[]} cc - Optional CC emails.
 * @param {string[]} bcc - Optional BCC emails.
 */
const sendMail = async (to, subject, text, html = null, cc = [], bcc = []) => {
  const mailOptions = {
    from: `"Carpool Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    ...(html && { html }),
    ...(cc.length > 0 && { cc }),
    ...(bcc.length > 0 && { bcc })
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} | Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

module.exports = sendMail;
