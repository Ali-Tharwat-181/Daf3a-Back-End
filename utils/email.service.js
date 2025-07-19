import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: "alitharwathassan@gmail.com", // your email from .env
    pass: "tiuhfcvezpwigjzx", // your password or app password
  },
});

/**
 * Sends an email
 * @param {string} to - Receiver's email
 * @param {string} subject - Email subject
 * @param {string} html - Email body as HTML
 */

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"MentorMatch" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
