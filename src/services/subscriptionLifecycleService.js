import { supabase } from "../supabaseClient";
import { getCurrentUser } from "./profileService";

/**
 * ============================================================
 * Subscription Lifecycle Service
 * Sprint 42.4 — Phase 1
 *
 * Determines subscription state transitions and whether
 * reactivation requires payment or is a simple status flip.
 * ============================================================
 */

/**
 * Returns the canonical lifecycle state for a subscription.
 *
 * @param {object} subscription
 * @returns {"active"|"pending_cancellation"|"cancelled"|"starter"}
 */
export function getSubscriptionState(subscription) {
  if (!subscription) return "starter";

  const plan = (subscription.plan || "").toLowerCase();
  const status = subscription.status || "";

  if (plan === "starter") return "starter";

  if (status === "Cancelled") return "cancelled";

  if (status === "Pending Cancellation") return "pending_cancellation";

  if (status === "Active") return "active";

  return "starter";
}

/**
 * Whether the subscription requires a new payment to reactivate.
 *
 * @param {object} subscription
 * @returns {boolean}
 */
export function requiresPayment(subscription) {
  const state = getSubscriptionState(subscription);

  if (state === "cancelled") return true;

  if (state === "starter") return true;

  return false;
}

/**
 * Whether the subscription can be reactivated without payment.
 * True when the user is in Pending Cancellation and the renewal
 * date has not yet passed (they already paid for this period).
 *
 * @param {object} subscription
 * @returns {boolean}
 */
export function canReactivateWithoutPayment(subscription) {
  const state = getSubscriptionState(subscription);

  if (state !== "pending_cancellation") return false;

  if (!subscription.renewal_date) return false;

  const renewal = new Date(subscription.renewal_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return renewal > today;
}

/**
 * Returns the reactivation mode for the current subscription.
 *
 * "immediate"  — flip status back to Active (no payment)
 * "payment"    — requires a new PayFast payment
 * "none"       — reactivation not applicable
 *
 * @param {object} subscription
 * @returns {"immediate"|"payment"|"none"}
 */
export function getReactivateMode(subscription) {
  const state = getSubscriptionState(subscription);

  if (state === "active") return "none";

  if (state === "pending_cancellation") {
    return canReactivateWithoutPayment(subscription) ? "immediate" : "payment";
  }

  if (state === "cancelled") return "payment";

  if (state === "starter") return "payment";

  return "none";
}

/**
 * Reactivates a subscription by flipping status back to Active.
 * Only valid when canReactivateWithoutPayment is true.
 *
 * Preserves the existing renewal_date (user already paid).
 *
 * @param {object} subscription
 * @returns {Promise<object>} Updated subscription row
 * @throws {Error} If reactivation without payment is not allowed
 */
export async function reactivateSubscription(subscription) {
  if (!canReactivateWithoutPayment(subscription)) {
    throw new Error(
      "Cannot reactivate without payment. Subscription requires a new payment."
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      status: "Active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscription.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Cancels a pending cancellation by restoring Active status.
 * Alias for reactivateSubscription — same operation, clearer intent.
 *
 * @param {object} subscription
 * @returns {Promise<object>} Updated subscription row
 */
export async function cancelPendingCancellation(subscription) {
  return reactivateSubscription(subscription);
}

export default {
  getSubscriptionState,
  requiresPayment,
  canReactivateWithoutPayment,
  getReactivateMode,
  reactivateSubscription,
  cancelPendingCancellation,
};
