import { supabase } from "../supabaseClient";
import { getCurrentUser, getProfile } from "./profileService";
import { getSubscription } from "./subscriptionService";

/**
 * ============================================================
 * Invoice Service
 * Sprint 42.6 — Phase 3
 *
 * Converts successful subscription payments into professional
 * invoice objects. No PDF generation — data layer only.
 * ============================================================
 */

/**
 * Derives a deterministic invoice number from a payment record.
 * Format: INV-YYYY-XXXXXX
 *
 * XXXXXX is a zero-padded value derived from the payment's created_at
 * timestamp (seconds since midnight) combined with a hash of the payment ID.
 * This ensures consistency — the same payment always produces the same number.
 *
 * @param {object} payment
 * @returns {string}
 */
export function getInvoiceNumber(payment) {
  if (!payment) return "INV-0000-000000";

  const date = payment.paid_at ? new Date(payment.paid_at) : new Date(payment.created_at || Date.now());
  const year = date.getFullYear();

  // Derive a consistent 6-digit sequence from the payment ID
  const id = payment.id || payment.transaction_id || "";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const sequence = Math.abs(hash) % 1000000;

  return `INV-${year}-${String(sequence).padStart(6, "0")}`;
}

/**
 * Generates a complete invoice object from a payment, subscription, and profile.
 *
 * @param {object} payment - Record from subscription_payments table
 * @param {object} subscription - Record from subscriptions table
 * @param {object} profile - Record from profiles table (or user metadata)
 * @returns {object} Invoice object
 */
export function generateInvoice(payment, subscription, profile) {
  if (!payment) return null;

  const invoiceNumber = getInvoiceNumber(payment);

  const invoiceDate = payment.paid_at || payment.created_at || new Date().toISOString();

  return {
    invoiceNumber,
    invoiceDate,
    customerName: profile?.full_name || profile?.name || "Feldrix Customer",
    farmName: profile?.farm_name || null,
    email: profile?.email || null,
    plan: payment.subscription_plan || subscription?.plan || "Pro",
    billingCycle: subscription?.billing_cycle || "Monthly",
    amount: Number(payment.amount || 0),
    currency: payment.currency || "ZAR",
    status: payment.status || "Completed",
    paymentProvider: payment.provider || subscription?.payment_provider || "PayFast",
    paymentReference: payment.payment_reference || payment.transaction_id || null,
    transactionId: payment.transaction_id || null,
    renewalDate: subscription?.renewal_date || null,
  };
}

/**
 * Fetches all invoice data for the authenticated user.
 * Combines payments with subscription and profile data to produce
 * complete invoice objects.
 *
 * @param {string} userId - Optional. If not provided, uses the current authenticated user.
 * @returns {Promise<object[]>} Array of invoice objects sorted by date (newest first)
 */
export async function getInvoiceData(userId) {
  let uid = userId;

  if (!uid) {
    const user = await getCurrentUser();
    if (!user) return [];
    uid = user.id;
  }

  // Fetch payments
  const { data: payments, error: payError } = await supabase
    .from("subscription_payments")
    .select("*")
    .eq("user_id", uid)
    .order("paid_at", { ascending: false });

  if (payError) {
    console.error("Failed to fetch payments for invoices:", payError.message);
    return [];
  }

  if (!payments || payments.length === 0) return [];

  // Fetch subscription
  const subscription = await getSubscription();

  // Fetch profile
  let profile = null;
  try {
    profile = await getProfile();
  } catch {
    // Profile may not exist — proceed without it
  }

  // Generate invoice objects
  return payments.map((payment) => generateInvoice(payment, subscription, profile));
}

export default {
  generateInvoice,
  getInvoiceNumber,
  getInvoiceData,
};
