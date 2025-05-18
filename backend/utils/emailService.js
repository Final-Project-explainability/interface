const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


console.log("🔑 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "[HIDDEN]" : "❌ NOT FOUND");



async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"MediClear ICU" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`📧 Email sent to ${to} - Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

module.exports = { sendEmail };
