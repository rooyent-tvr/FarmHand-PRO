import { supabase } from "./supabase";

/*
 * Get all health records
 */
export async function getHealthRecords() {
  const { data, error } = await supabase
    .from("animal_health")
    .select(`
      *,
      livestock (
        id,
        tag,
        breed,
        animal_type
      )
    `)
    .order("treatment_date", { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  return data || [];
}

/*
 * Get all animals
 */
export async function getAnimals() {
  const { data, error } = await supabase
    .from("livestock")
    .select(`
      id,
      tag,
      breed,
      animal_type
    `)
    .order("tag");

  if (error) {
    console.error(error);
    throw error;
  }

  return data || [];
}

/*
 * Add health record
 */
export async function addHealthRecord(record) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("animal_health")
    .insert([
      {
        ...record,
        user_id: user.id,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data[0];
}

/*
 * Update health record
 */
export async function updateHealthRecord(id, updates) {
  const { data, error } = await supabase
    .from("animal_health")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data[0];
}

/*
 * Delete health record
 */
export async function deleteHealthRecord(id) {
  const { error } = await supabase
    .from("animal_health")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }

  return true;
}
