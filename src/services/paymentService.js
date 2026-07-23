/**
 * ============================================
 * FarmHand PRO
 * Payment Service
 * Sprint 40 - Phase 2.1
 * ============================================
 */

import {
  createUpgradePayment,
  buildFormFields,
  getPayFastUrl,
  validateConfiguration,
} from "./payfastService";

import { attachSignature } from "../utils/payfastSignature";

/**
 * Creates and submits a PayFast payment.
 */
export async function startUpgradePayment({
  customer,
  subscriptionId,
}) {
  const config = validateConfiguration();

  if (!config.valid) {
    throw new Error(config.errors.join("\n"));
  }

  // Create payment payload
  const payload = createUpgradePayment({
    customer,
    subscriptionId,
  });

  // Attach signature
  const signedPayload = await attachSignature(payload);

  // Build form fields
  const fields = buildFormFields(signedPayload);

  // Submit hidden form
  submitForm(fields);

  return {
    success: true,
  };
}

/**
 * Creates a hidden HTML form and submits it to PayFast.
 */
function submitForm(fields) {
  const form = document.createElement("form");

  form.method = "POST";
  form.action = getPayFastUrl();
  form.style.display = "none";

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");

    input.type = "hidden";
    input.name = key;
    input.value = value;

    form.appendChild(input);
  });

  document.body.appendChild(form);

  form.submit();

  document.body.removeChild(form);
}

/**
 * Placeholder for future payment verification.
 */
export async function verifyPayment() {
  return {
    success: true,
    message: "Verification will be implemented in Phase 2.2",
  };
}

/**
 * Placeholder for billing history.
 */
export async function getPaymentHistory() {
  return [];
}

/**
 * Placeholder for invoice generation.
 */
export async function generateInvoice() {
  return null;
}

export default {
  startUpgradePayment,
  verifyPayment,
  getPaymentHistory,
  generateInvoice,
};
