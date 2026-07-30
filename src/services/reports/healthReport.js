import { supabase } from "../supabase";

export async function generateHealthReport() {
  const { data } = await supabase.from("animal_health").select("*");
  const records = data || [];
  const vaccinations = records.filter((r) => r.treatment_type === "Vaccination").length;
  const treatments = records.filter((r) => r.treatment_type === "Treatment" || r.treatment_type === "Medication").length;

  return {
    title: "Animal Health Report",
    statistics: { totalRecords: records.length, vaccinations, treatments, deworming: records.filter((r) => r.treatment_type === "Deworming").length },
    sections: [
      { title: "Treatment Types", items: summarizeByField(records, "treatment_type") },
    ],
    aiSummary: vaccinations > 0 ? "Vaccination programme active." : "No vaccinations recorded. Consider scheduling a herd vaccination.",
  };
}

function summarizeByField(records, field) {
  const grouped = {};
  for (const r of records) { const k = r[field] || "Unknown"; grouped[k] = (grouped[k] || 0) + 1; }
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
