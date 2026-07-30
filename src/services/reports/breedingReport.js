import { supabase } from "../supabase";

export async function generateBreedingReport() {
  const { data } = await supabase.from("breeding_records").select("*");
  const records = data || [];
  const pregnant = records.filter((r) => r.status === "Pregnant" || r.status === "Confirmed").length;
  const completed = records.filter((r) => r.status === "Completed").length;
  const successRate = records.length > 0 ? Math.round(((pregnant + completed) / records.length) * 100) : 0;

  return {
    title: "Breeding Performance Report",
    statistics: { totalRecords: records.length, pregnant, completed, successRate: `${successRate}%` },
    sections: [
      { title: "Breeding Status", items: summarizeByField(records, "status") },
      { title: "Methods Used", items: summarizeByField(records, "breeding_method") },
    ],
    aiSummary: successRate >= 70 ? "Breeding programme performing well." : "Consider reviewing breeding timing and nutrition.",
  };
}

function summarizeByField(records, field) {
  const grouped = {};
  for (const r of records) { const k = r[field] || "Unknown"; grouped[k] = (grouped[k] || 0) + 1; }
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
