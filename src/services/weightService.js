import { supabase } from "./supabase";

/*
---------------------------------------
Get all weight records for one animal
---------------------------------------
*/
export async function getWeightHistory(animalId) {
  const { data, error } = await supabase
    .from("weight_history")
    .select("*")
    .eq("animal_id", animalId)
    .order("recorded_at", { ascending: false });

  if (error) throw error;

  return data;
}

/*
---------------------------------------
Add new weight
---------------------------------------
*/
export async function addWeight(record) {
  const { data, error } = await supabase
    .from("weight_history")
    .insert([record])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/*
---------------------------------------
Delete weight record
---------------------------------------
*/
export async function deleteWeight(id) {
  const { error } = await supabase
    .from("weight_history")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
