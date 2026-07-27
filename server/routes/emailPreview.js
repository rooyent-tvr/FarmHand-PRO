import express from "express";
import { renderTemplate } from "../services/email/templates.js";

const router = express.Router();

/**
 * Payment Receipt Preview
 */
router.get("/payment-receipt", async (req, res) => {
  try {
    const html = await renderTemplate("paymentReceipt", {
      LOGO_URL: "http://localhost:5000/branding/farmhand-logo.png",
      CUSTOMER_NAME: "John Farmer",
      INVOICE_NUMBER: "INV-2026-0001",
      AMOUNT: "99.00",
      PAYMENT_REFERENCE: "PF123456789",
      RENEWAL_DATE: "23 August 2026",
      APP_URL: "http://localhost:5173",
      SUPPORT_EMAIL: "support@farmhandpro.com",
    });

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

/**
 * Welcome Email Preview
 */
router.get("/welcome", async (req, res) => {
  try {
    const html = await renderTemplate("welcomeEmail", {
      LOGO_URL: "http://localhost:5000/branding/farmhand-logo.png",
      CUSTOMER_NAME: "John Farmer",
      APP_URL: "http://localhost:5173",
      SUPPORT_EMAIL: "support@farmhandpro.com",
    });

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

export default router;
