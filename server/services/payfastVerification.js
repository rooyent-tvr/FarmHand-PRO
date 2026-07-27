export async function verifyPayment({
  userId,
  transactionId,
  paymentReference,
  provider = "PayFast",
  amount = 99,
  itnData = {},
}) {
  if (!userId) {
    throw new Error("Missing user.");
  }

  if (!transactionId) {
    throw new Error("Missing transaction ID.");
  }

  const exists = await paymentExists(transactionId);

  if (exists) {
    return {
      success: false,
      reason: "Payment already processed.",
    };
  }

  // Verify PayFast signature
  if (
    Object.keys(itnData).length > 0 &&
    !verifySignature(
      itnData,
      process.env.PAYFAST_PASSPHRASE || ""
    )
  ) {
    return {
      success: false,
      reason: "Invalid PayFast signature.",
    };
  }

  // Verify directly with PayFast
  const verified = await validateWithPayFast(itnData);

  if (!verified) {
    return {
      success: false,
      reason: "PayFast validation failed.",
    };
  }

  // Verify merchant ID
  if (
    itnData.merchant_id &&
    itnData.merchant_id !== process.env.PAYFAST_MERCHANT_ID
  ) {
    return {
      success: false,
      reason: "Merchant ID mismatch.",
    };
  }

  // Verify payment completed
  if (
    itnData.payment_status &&
    itnData.payment_status.toUpperCase() !== "COMPLETE"
  ) {
    return {
      success: false,
      reason: `Payment status is ${itnData.payment_status}.`,
    };
  }

  // Verify expected amount
  const expectedAmount = Number(
    process.env.PAYFAST_SUBSCRIPTION_AMOUNT
  );

  if (
    Number(itnData.amount_gross) !== expectedAmount
  ) {
    return {
      success: false,
      reason: "Incorrect payment amount.",
    };
  }

  console.log("✓ PayFast payment validated successfully.");

  const payment = await createPayment({
    userId,
    provider,
    amount,
    transactionId,
    paymentReference,
  });

  const subscription = await activateSubscription({
    userId,
    paymentProvider: provider,
    paymentReference,
  });

  return {
    success: true,
    payment,
    subscription,
  };
}
