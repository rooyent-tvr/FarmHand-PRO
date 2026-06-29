import { supabase } from "./supabase";

export async function getAnimals() {
  const { data, error } = await supabase
    .from("livestock")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addAnimal(animal) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase.from("livestock").insert([
    {
      ...animal,
      user_id: user.id,
    },
  ]);

  if (error) throw error;
}

export async function updateAnimal(id, updates) {
  const { error } = await supabase
    .from("livestock")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteAnimal(id) {
  const { error } = await supabase
    .from("livestock")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
