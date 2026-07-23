import { supabase } from "../supabaseClient";

const TABLE = "subscription_payments";

/**
 * Get all payments for the current user
 */
export async function getPaymentHistory(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get the most recent payment
 */
export async function getLatestPayment(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

/**
 * Create a payment record
 */
export async function createPayment(payment) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([payment])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get payments by status
 */
export async function getPaymentsByStatus(userId, status) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .order("paid_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get total amount paid
 */
export async function getTotalPaid(userId) {
  const payments = await getPaymentHistory(userId);

  return payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );
}

/**
 * Generate the next invoice number
 *
 * Format:
 * FHP-YYYY-XXXXXX
 */
export function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;

  return `FHP-${year}-${random}`;
}

/**
 * Demo helper used until PayFast callbacks are connected.
 */
export async function createDemoPayment(userId) {
  return createPayment({
    user_id: userId,
    provider: "PayFast",
    amount: 99,
    currency: "ZAR",
    status: "Completed",
    subscription_plan: "Pro",
    payment_reference: crypto.randomUUID(),
    transaction_id: crypto.randomUUID(),
    invoice_number: generateInvoiceNumber(),
    paid_at: new Date().toISOString(),
  });
}

export default {
  getPaymentHistory,
  getLatestPayment,
  createPayment,
  getPaymentsByStatus,
  getTotalPaid,
  generateInvoiceNumber,
  createDemoPayment,
};
