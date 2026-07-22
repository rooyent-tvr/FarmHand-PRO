import { supabase } from "../supabaseClient";
import { getCurrentUser } from "./profileService";

export async function getSubscription() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // First login - create a Starter subscription
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
