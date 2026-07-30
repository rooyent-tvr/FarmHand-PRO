import { supabase } from "../supabase";

export async function generateFinanceReport({ from, to }) {
  const { data: records } = await supabase
    .from("finance_records")
    .select("*")
    .gte("transaction_date", from.split("T")[0])
    .lte("transaction_date", to.split("T")[0])
    .order("transaction_date", { ascending: false });

  const data = records || [];
  const income = data.filter((r) => r.category === "Income").reduce((s, r) => s + Number(r.amount || 0), 0);
  const expenses = data.filter((r) => r.category === "Expense").reduce((s, r) => s + Number(r.amount || 0), 0);

  return {
    title: "Monthly Finance Report",
    statistics: { totalRecords: data.length, income, expenses, profit: income - expenses, profitMargin: income > 0 ? ((income - expenses) / income * 100).toFixed(1) + "%" : "0%" },
    sections: [
      { title: "Income Summary", items: summarizeByType(data.filter((r) => r.category === "Income")) },
      { title: "Expense Summary", items: summarizeByType(data.filter((r) => r.category === "Expense")) },
    ],
    aiSummary: income > expenses ? "Farm is profitable for this period. Continue monitoring expenses." : "Expenses exceed income. Review cost categories for savings.",
  };
}

function summarizeByType(records) {
  const grouped = {};
  for (const r of records) { grouped[r.transaction_type] = (grouped[r.transaction_type] || 0) + Number(r.amount || 0); }
  return Object.entries(grouped).map(([type, amount]) => ({ label: type, value: `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}` }));
}
