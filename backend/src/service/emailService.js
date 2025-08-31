const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Helper to send verification email
 const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}?token=${token}`;

  const mailOptions = {
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <p>Hello ${user.name},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
module.exports={sendVerificationEmail}