import { supabase } from "../supabaseClient";

export async function getSecurityInfo() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  if (!user) {
    return null;
  }

  return {
    email: user.email || "",
    emailVerified:
      !!user.email_confirmed_at,
    lastSignIn:
      user.last_sign_in_at || null,
  };
}

export async function changePassword(
  newPassword
) {
  const { error } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (error) {
    throw error;
  }

  return true;
}
