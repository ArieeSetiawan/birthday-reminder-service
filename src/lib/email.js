const nodemailer = require("nodemailer");
const config = require('../config/env.js');

let transporter;

/**
 * Initializes and caches Nodemailer transporter.
 * Uses Ethereal in development and SMTP config in production.
 */
async function initEmail() {
  if (transporter) return transporter;

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log("Ethereal email ready:", testAccount.user);
  } else {
    transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
        });
  }
  return transporter;
}

/**
 * Sends an email using configured transporter.
 * Logs preview URL in non-production environments.
 *
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} [params.text]
 * @param {string} [params.html]
 * @returns {Promise<Object>} Nodemailer response
 */
async function sendEmail({ to, subject, text, html }) {
  const t = await initEmail();

  const info = await t.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to,
    subject,
    text,
    html,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
}

module.exports = {
  sendEmail,
};