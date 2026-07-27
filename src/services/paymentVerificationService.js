import {
  createPayment,
  paymentExists,
} from "./billingService";

import {
  activateSubscription,
} from "./subscriptionActivationService";

/**
 * Check if a transaction has already been processed.
 */
export async function paymentAlreadyProcessed(transactionId) {
  if (!transactionId) return false;

  return paymentExists(transactionId);
}

/**
 * Placeholder verification.
 *
 * In a later phase this will be replaced with
 * real PayFast ITN verification.
 */
export async function verifyPayment({
  userId,
  transactionId,
  amount = 99,
  provider = "PayFast",
}) {
  if (!userId) {
    return {
      success: false,
      reason: "Missing user.",
    };
  }

  if (!transactionId) {
    return {
      success: false,
      reason: "Missing transaction ID.",
    };
  }

  const exists = await paymentAlreadyProcessed(
    transactionId
  );

  if (exists) {
    return {
      success: false,
      reason: "Payment already processed.",
    };
  }

  return {
    success: true,
    verified: true,
    provider,
    amount,
    transactionId,
  };
}

/**
 * Process a verified payment.
 *
 * Records the payment and activates
 * the user's subscription.
 */
export async function processVerifiedPayment({
  userId,
  transactionId,
  invoiceNumber,
  amount = 99,
  provider = "PayFast",
}) {
  const verification = await verifyPayment({
    userId,
    transactionId,
    amount,
    provider,
  });

  if (!verification.success) {
    return verification;
  }

  const payment = await createPayment({
    user_id: userId,
    provider,
    amount,
    currency: "ZAR",
    status: "Completed",
    subscription_plan: "Pro",
    payment_reference: transactionId,
    transaction_id: transactionId,
    invoice_number: invoiceNumber,
    paid_at: new Date().toISOString(),
  });

  const subscription = await activateSubscription({
    userId,
    paymentProvider: provider,
    paymentReference: transactionId,
  });

  return {
    success: true,
    verified: true,
    payment,
    subscription,
  };
}

export default {
  verifyPayment,
  processVerifiedPayment,
  paymentAlreadyProcessed,
};
