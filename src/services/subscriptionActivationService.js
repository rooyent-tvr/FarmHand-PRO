import { supabase } from "../supabaseClient";

/**
 * Calculate the next renewal date.
 * Default billing cycle is 30 days.
 */
export function calculateRenewalDate(startDate = new Date()) {
  const renewal = new Date(startDate);
  renewal.setDate(renewal.getDate() + 30);

  return renewal.toISOString();
}

/**
 * Activate a PRO subscription.
 */
export async function activateSubscription({
  userId,
  paymentProvider = "PayFast",
  paymentReference = null,
}) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const now = new Date();

  const updates = {
    plan: "Pro",
    status: "Active",
    billing_cycle: "Monthly",
    price: 99,
    renewal_date: calculateRenewalDate(now),
    payment_provider: paymentProvider,
    payment_reference: paymentReference,
    updated_at: now.toISOString(),
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Renew an existing subscription.
 */
export async function renewSubscription(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data: current, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  const baseDate = current?.renewal_date
    ? new Date(current.renewal_date)
    : new Date();

  const updates = {
    status: "Active",
    renewal_date: calculateRenewalDate(baseDate),
    updated_at: new Date().toISOString(),
  };

  const { data, error: updateError } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return data;
}

/**
 * Schedule cancellation at the end of the billing period.
 */
export async function scheduleCancellation(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      status: "Pending Cancellation",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Downgrade the user back to Starter.
 */
export async function downgradeToStarter(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      plan: "Starter",
      status: "Active",
      billing_cycle: null,
      price: 0,
      renewal_date: null,
      payment_provider: null,
      payment_reference: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export default {
  activateSubscription,
  renewSubscription,
  scheduleCancellation,
  downgradeToStarter,
  calculateRenewalDate,
};
