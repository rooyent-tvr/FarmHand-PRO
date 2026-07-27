import express from "express";

import {
  verifyPayment,
} from "../services/payfastVerification.js";

const router = express.Router();

/**
 * Health Check
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    service: "PayFast API",
    status: "Running",
  });
});

/**
 * Customer returns after payment.
 */
router.post("/return", (req, res) => {
  console.log("PayFast Return");

  res.json({
    success: true,
    message: "Return received.",
  });
});

/**
 * Customer cancelled payment.
 */
router.post("/cancel", (req, res) => {
  console.log("PayFast Cancel");

  res.json({
    success: true,
    message: "Cancellation received.",
  });
});

/**
 * PayFast Instant Transaction Notification (ITN)
 */
router.post("/itn", async (req, res) => {
  try {
    console.log("========== PAYFAST ITN ==========");
    console.log(req.body);
    console.log("================================");

    const {
      custom_str1,
      pf_payment_id,
      m_payment_id,
      amount_gross,
    } = req.body;

    const result = await verifyPayment({
      userId: custom_str1,
      transactionId: pf_payment_id,
      paymentReference: m_payment_id,
      amount: Number(amount_gross),
      provider: "PayFast",

      // NEW: Pass the complete ITN payload
      itnData: req.body,
    });

    if (!result.success) {
      console.warn("PayFast verification failed:", result.reason);

      return res.status(400).json(result);
    }

    console.log("PayFast payment verified successfully.");

    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayFast ITN Error");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
