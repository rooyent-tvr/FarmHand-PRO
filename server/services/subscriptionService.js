import { supabase } from "../config/supabase.js";

/**
 * Calculate next monthly renewal date.
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
  const updates = {
    plan: "Pro",
    status: "Active",
    billing_cycle: "Monthly",
    price: 99,
    renewal_date: calculateRenewalDate(),
    payment_provider: paymentProvider,
    payment_reference: paymentReference,
    updated_at: new Date().toISOString(),
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
    renewal_date: calculateRenewalDate(baseDate),
    status: "Active",
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
 * Schedule cancellation.
 */
export async function scheduleCancellation(userId) {
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
 * Downgrade to Starter.
 */
export async function downgradeToStarter(userId) {
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
