import { supabase } from "../config/supabase.js";

const TABLE = "subscription_payments";

/**
 * Generate invoice number.
 */
export function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;

  return `FHP-${year}-${random}`;
}

/**
 * Check whether a transaction already exists.
 */
export async function paymentExists(transactionId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id")
    .eq("transaction_id", transactionId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

/**
 * Create payment record.
 */
export async function createPayment({
  userId,
  provider,
  amount,
  currency = "ZAR",
  transactionId,
  paymentReference,
  subscriptionPlan = "Pro",
}) {
  const invoiceNumber = generateInvoiceNumber();

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        user_id: userId,
        provider,
        amount,
        currency,
        status: "Completed",
        subscription_plan: subscriptionPlan,
        payment_reference: paymentReference,
        transaction_id: transactionId,
        invoice_number: invoiceNumber,
        paid_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get payment history.
 */
export async function getPaymentHistory(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get latest payment.
 */
export async function getLatestPayment(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export default {
  paymentExists,
  createPayment,
  getPaymentHistory,
  getLatestPayment,
  generateInvoiceNumber,
};
