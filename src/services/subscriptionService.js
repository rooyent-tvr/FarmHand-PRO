import { supabase } from "../supabaseClient";
import { getCurrentUser } from "./profileService";

/*
|--------------------------------------------------------------------------
| Feature Matrix
|--------------------------------------------------------------------------
*/

const PLAN_FEATURES = {
  starter: [
    "dashboard",
    "livestock",
    "crops",
    "machinery",
    "planner",
    "finance",
    "reports",
    "weather",
  ],

  pro: [
    "dashboard",
    "livestock",
    "crops",
    "machinery",
    "planner",
    "finance",
    "reports",
    "weather",

    "ai",
    "farm_intelligence",
    "predictive_analytics",
    "automation",
    "advanced_reports",
    "weekly_summary",
    "priority_support",
  ],
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizePlan(plan) {
  return String(plan || "starter").toLowerCase();
}

/*
|--------------------------------------------------------------------------
| Core Subscription
|--------------------------------------------------------------------------
*/

export async function getSubscription() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // First login - create Starter subscription
    if (error.code === "PGRST116") {
      return await createSubscription();
    }

    throw error;
  }

  return data;
}

export async function createSubscription() {
  const user = await getCurrentUser();

  if (!user) return null;

  const subscription = {
    user_id: user.id,
    plan: "Starter",
    status: "Active",
    billing_cycle: "Monthly",
    price: 0,
    payment_provider: null,
    customer_reference: null,
    trial_ends_at: null,
    renewal_date: null,
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSubscription(values) {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .update(values)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Plans
|--------------------------------------------------------------------------
*/

export async function upgradeToPro() {
  return updateSubscription({
    plan: "Pro",
    status: "Active",
    billing_cycle: "Monthly",
    price: 99,
  });
}

export async function downgradeToStarter() {
  return updateSubscription({
    plan: "Starter",
    status: "Active",
    billing_cycle: "Monthly",
    price: 0,
  });
}

export async function cancelSubscription() {
  return updateSubscription({
    status: "Cancelled",
  });
}

export async function reactivateSubscription() {
  return updateSubscription({
    status: "Active",
  });
}

/*
|--------------------------------------------------------------------------
| Status Helpers
|--------------------------------------------------------------------------
*/

export async function isPro() {
  const subscription = await getSubscription();

  if (!subscription) return false;

  return normalizePlan(subscription.plan) === "pro";
}

export async function isStarter() {
  const subscription = await getSubscription();

  if (!subscription) return true;

  return normalizePlan(subscription.plan) === "starter";
}

export async function isActive() {
  const subscription = await getSubscription();

  if (!subscription) return false;

  return subscription.status === "Active";
}

export async function isTrial() {
  const subscription = await getSubscription();

  if (!subscription) return false;

  return subscription.status === "Trial";
}

/*
|--------------------------------------------------------------------------
| Feature Permissions
|--------------------------------------------------------------------------
*/

export async function hasFeature(feature) {
  const subscription = await getSubscription();

  if (!subscription) return false;

  const plan = normalizePlan(subscription.plan);

  const features =
    PLAN_FEATURES[plan] || PLAN_FEATURES.starter;

  return features.includes(feature);
}

export async function getAvailableFeatures() {
  const subscription = await getSubscription();

  if (!subscription) return [];

  const plan = normalizePlan(subscription.plan);

  return PLAN_FEATURES[plan] || PLAN_FEATURES.starter;
}

/*
|--------------------------------------------------------------------------
| Billing Helpers
|--------------------------------------------------------------------------
*/

export async function getCurrentPlan() {
  const subscription = await getSubscription();

  return subscription?.plan ?? "Starter";
}

export async function getSubscriptionStatus() {
  const subscription = await getSubscription();

  return subscription?.status ?? "Inactive";
}

export async function getSubscriptionPrice() {
  const subscription = await getSubscription();

  return subscription?.price ?? 0;
}
