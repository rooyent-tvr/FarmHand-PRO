import { supabase } from "./supabase";

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function addTransaction(transaction) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        ...transaction,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getFinanceSummary() {
  const transactions = await getTransactions();

  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return {
    income,
    expenses,
    profit: income - expenses,
    transactions,
  };
}
