import { supabase } from "../supabaseClient";

/**
 * Returns the currently authenticated user.
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}

/**
 * Returns the logged-in user's profile.
 */
export async function getProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

/**
 * Creates a profile if one doesn't already exist.
 */
export async function createProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const profile = await getProfile();

  if (profile) {
    return profile;
  }

  const newProfile = {
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",
    email: user.email,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(newProfile)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Updates the user's profile.
 */
export async function updateProfile(values) {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
