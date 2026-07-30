import { supabase } from "../supabase";

export async function generateMachineryReport() {
  const { data: machines } = await supabase.from("machinery").select("*");
  const list = machines || [];
  const active = list.filter((m) => m.status === "Active").length;
  const totalValue = list.reduce((s, m) => s + Number(m.purchase_price || 0), 0);

  return {
    title: "Machinery Cost Report",
    statistics: { totalMachines: list.length, active, fleetValue: `R ${totalValue.toLocaleString("en-ZA")}` },
    sections: [
      { title: "Fleet Status", items: summarizeByField(list, "status") },
      { title: "Categories", items: summarizeByField(list, "category") },
    ],
    aiSummary: active === list.length ? "All machines operational." : `${list.length - active} machines currently not active.`,
  };
}

function summarizeByField(records, field) {
  const grouped = {};
  for (const r of records) { const k = r[field] || "Unknown"; grouped[k] = (grouped[k] || 0) + 1; }
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
