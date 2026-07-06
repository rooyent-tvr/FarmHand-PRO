import { supabase } from "./supabase";

export async function getFinanceRecords() {
  const { data, error } = await supabase
    .from("finance_records")
    .select(`
      *,
      animal:livestock (
        id,
        tag,
        breed
      )
    `)
    .order("transaction_date", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function getAnimalFinance(animalId) {
  const { data, error } = await supabase
    .from("finance_records")
    .select("*")
    .eq("animal_id", animalId)
    .order("transaction_date", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function addFinanceRecord(record) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("finance_records")
    .insert([
      {
        ...record,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateFinanceRecord(
  id,
  updates
) {
  const { data, error } = await supabase
    .from("finance_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteFinanceRecord(id) {
  const { error } = await supabase
    .from("finance_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getFinanceSummary() {
  const records = await getFinanceRecords();

  const income = records
    .filter(
      (r) => r.category === "Income"
    )
    .reduce(
      (sum, r) =>
        sum + Number(r.amount || 0),
      0
    );

  const expenses = records
    .filter(
      (r) => r.category === "Expense"
    )
    .reduce(
      (sum, r) =>
        sum + Number(r.amount || 0),
      0
    );

  return {
    income,
    expenses,
    profit: income - expenses,
    records,
  };
}
