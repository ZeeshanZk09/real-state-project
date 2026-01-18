import { ENV } from "@/utils/constants";
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: ENV.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: from || ENV.EMAIL_FROM || '"Zebotix WBAs" <noreply@zebotix.com>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Verify connection configuration
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("SMTP server connection verified");
    return { success: true };
  } catch (error) {
    console.error("Error verifying email connection:", error);
    return { success: false, error };
  }
}
