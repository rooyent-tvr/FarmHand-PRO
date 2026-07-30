import { supabase } from "../supabase";

export async function generateLivestockReport() {
  const { data: animals } = await supabase.from("livestock").select("*");
  const list = animals || [];
  const healthy = list.filter((a) => a.status === "Healthy").length;
  const pregnant = list.filter((a) => a.status === "Pregnant").length;
  const avgWeight = list.length > 0 ? Math.round(list.reduce((s, a) => s + Number(a.weight || 0), 0) / list.length) : 0;

  return {
    title: "Livestock Performance Report",
    statistics: { totalAnimals: list.length, healthy, pregnant, averageWeight: `${avgWeight} kg` },
    sections: [
      { title: "Herd Composition", items: summarizeByField(list, "animal_type") },
      { title: "Health Status", items: summarizeByField(list, "status") },
    ],
    aiSummary: healthy === list.length ? "Entire herd is healthy." : `${list.length - healthy} animals require attention.`,
  };
}

function summarizeByField(records, field) {
  const grouped = {};
  for (const r of records) { const k = r[field] || "Unknown"; grouped[k] = (grouped[k] || 0) + 1; }
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
