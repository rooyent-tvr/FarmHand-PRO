import { supabase } from "./supabase";

export async function getBreedingRecords() {
  const { data, error } = await supabase
    .from("breeding_records")
    .select(`
      *,
      female:female_id(tag, breed, animal_type),
      male:male_id(tag, breed, animal_type)
    `)
    .order("breeding_date", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

/*
 * Get breeding history for ONE animal
 * (Animal Profile)
 */
export async function getBreedingHistory(animalId) {
  const { data, error } = await supabase
    .from("breeding_records")
    .select(`
      *,
      female:female_id(tag, breed, animal_type),
      male:male_id(tag, breed, animal_type)
    `)
    .or(`female_id.eq.${animalId},male_id.eq.${animalId}`)
    .order("breeding_date", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function addBreedingRecord(record) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("breeding_records")
    .insert([
      {
        ...record,
        user_id: user.id,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

export async function updateBreedingRecord(id, record) {
  const { data, error } = await supabase
    .from("breeding_records")
    .update(record)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteBreedingRecord(id) {
  const { error } = await supabase
    .from("breeding_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getFemaleAnimals() {
  const { data, error } = await supabase
    .from("livestock")
    .select("*")
    .in("gender", [
      "Female",
      "Cow",
      "Ewe",
      "Doe",
      "Sow",
      "Hen",
    ])
    .order("tag");

  if (error) throw error;

  return data || [];
}

export async function getMaleAnimals() {
  const { data, error } = await supabase
    .from("livestock")
    .select("*")
    .in("gender", [
      "Male",
      "Bull",
      "Ram",
      "Buck",
      "Boar",
      "Rooster",
    ])
    .order("tag");

  if (error) throw error;

  return data || [];
}
