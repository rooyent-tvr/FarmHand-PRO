/**
 * FarmHand PRO
 * Email Service
 *
 * Central email service for the application.
 * Uses HTML templates with placeholder replacement.
 */

import { send } from "./providers.js";
import { renderTemplate } from "./templates.js";

/**
 * Generic email sender
 */
export async function sendEmail({
  to,
  subject,
  html,
  text = "",
  attachments = [],
}) {
  try {
    console.log("==================================");
    console.log("Sending Email");
    console.log("----------------------------------");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("==================================");

    return await send({
      to,
      subject,
      html,
      text,
      attachments,
    });
  } catch (error) {
    console.error("Email Service Error");
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send Payment Receipt
 */
export async function sendPaymentReceipt({
  email,
  customerName,
  invoiceNumber,
  amount,
  paymentReference,
  renewalDate,
  appUrl = process.env.APP_URL || "http://localhost:5173",
  supportEmail =
    process.env.SUPPORT_EMAIL ||
    "support@farmhandpro.com",
  logoUrl =
    process.env.LOGO_URL ||
    `${process.env.APP_URL || "http://localhost:5173"}/assets/branding/farmhand-logo.png`,
}) {
  const html = await renderTemplate(
    "paymentReceipt",
    {
      LOGO_URL: logoUrl,
      CUSTOMER_NAME: customerName,
      INVOICE_NUMBER: invoiceNumber,
      AMOUNT: amount,
      PAYMENT_REFERENCE: paymentReference,
      RENEWAL_DATE: renewalDate ?? "-",
      APP_URL: appUrl,
      SUPPORT_EMAIL: supportEmail,
    }
  );

  return sendEmail({
    to: email,
    subject: "FarmHand PRO Payment Receipt",
    html,
  });
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail({
  email,
  customerName,
  appUrl = process.env.APP_URL || "http://localhost:5173",
  supportEmail =
    process.env.SUPPORT_EMAIL ||
    "support@farmhandpro.com",
  logoUrl =
    process.env.LOGO_URL ||
    `${process.env.APP_URL || "http://localhost:5173"}/assets/branding/farmhand-logo.png`,
}) {
  const html = await renderTemplate(
    "welcomeEmail",
    {
      LOGO_URL: logoUrl,
      CUSTOMER_NAME: customerName,
      APP_URL: appUrl,
      SUPPORT_EMAIL: supportEmail,
    }
  );

  return sendEmail({
    to: email,
    subject: "Welcome to FarmHand PRO",
    html,
  });
}

export default {
  sendEmail,
  sendPaymentReceipt,
  sendWelcomeEmail,
};
