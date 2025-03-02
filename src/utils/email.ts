import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
<p>Hello,</p>

<p>We received a request to reset your password. Click the link below to reset it:</p>

<p>
  <a href="${resetUrl}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">
    Reset Your Password
  </a>
</p>

<p>This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>

<p>Best regards,</p>
<p>Your Company Team</p>

<hr>

<p style="font-size: 12px; color: #888;">
  If you have trouble clicking the "Reset Your Password" button, copy and paste the following URL into your browser: <br>
  <a href="${resetUrl}" style="color: #4CAF50; text-decoration: none;">${resetUrl}</a>
</p>
`,
  });
};
