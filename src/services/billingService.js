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
 * Find a payment by transaction ID
 */
export async function findPaymentByTransactionId(transactionId) {
  if (!transactionId) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("transaction_id", transactionId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

/**
 * Check whether a payment already exists
 */
export async function paymentExists(transactionId) {
  const payment = await findPaymentByTransactionId(transactionId);

  return !!payment;
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
  findPaymentByTransactionId,
  paymentExists,
  createPayment,
  getPaymentsByStatus,
  getTotalPaid,
  generateInvoiceNumber,
  createDemoPayment,
};

// ============================================================
// Billing Centre — Sprint 42.6
// ============================================================

/**
 * Get all invoices (payments) for a user, formatted as invoice records.
 * Maps subscription_payments to invoice-style objects.
 */
export async function getInvoices(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((payment) => ({
    id: payment.id,
    invoice_number: payment.invoice_number || null,
    amount: Number(payment.amount || 0),
    currency: payment.currency || "ZAR",
    status: payment.status || "Completed",
    provider: payment.provider || "PayFast",
    plan: payment.subscription_plan || "Pro",
    paid_at: payment.paid_at,
    transaction_id: payment.transaction_id,
    payment_reference: payment.payment_reference,
  }));
}

/**
 * Get all payments for a user (alias with consistent naming).
 */
export async function getPayments(userId) {
  return getPaymentHistory(userId);
}

/**
 * Get subscription lifecycle events for a user.
 * Constructs a timeline from payments and subscription metadata.
 * Returns events sorted newest first.
 */
export async function getSubscriptionEvents(userId) {
  if (!userId) return [];

  const { data: payments, error: payError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("paid_at", { ascending: false });

  if (payError) throw payError;

  const { data: subscriptions, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (subError) throw subError;

  const events = [];

  // Subscription creation events
  for (const sub of subscriptions ?? []) {
    events.push({
      id: `sub-created-${sub.id}`,
      type: "subscription_created",
      title: `${sub.plan} subscription created`,
      description: `Billing cycle: ${sub.billing_cycle || "Monthly"}`,
      date: sub.created_at,
      status: sub.status,
    });

    if (sub.status === "Pending Cancellation") {
      events.push({
        id: `sub-cancel-${sub.id}`,
        type: "cancellation_requested",
        title: "Cancellation requested",
        description: "Subscription will end at the current billing period",
        date: sub.updated_at,
        status: "warning",
      });
    }
  }

  // Payment events
  for (const payment of payments ?? []) {
    events.push({
      id: `pay-${payment.id}`,
      type: "payment",
      title: `Payment of R${Number(payment.amount || 0).toFixed(2)}`,
      description: `${payment.provider || "PayFast"} — ${payment.invoice_number || payment.transaction_id}`,
      date: payment.paid_at,
      status: payment.status === "Completed" ? "success" : "pending",
    });
  }

  // Sort by date descending
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return events;
}
