import { supabase } from "../supabase";

export async function generateCropReport() {
  const { data } = await supabase.from("crops").select("*");
  const crops = data || [];
  const growing = crops.filter((c) => c.status === "Growing").length;
  const harvested = crops.filter((c) => c.status === "Harvested").length;
  const totalArea = crops.reduce((s, c) => s + Number(c.area || 0), 0);

  return {
    title: "Crop Performance Report",
    statistics: { totalCrops: crops.length, growing, harvested, totalArea: `${totalArea.toFixed(1)} ha` },
    sections: [
      { title: "Crop Status", items: summarizeByField(crops, "status") },
      { title: "Crop Types", items: summarizeByField(crops, "crop_name") },
    ],
    aiSummary: growing > 0 ? `${growing} crops actively growing.` : "No active crops. Consider planning next season.",
  };
}

function summarizeByField(records, field) {
  const grouped = {};
  for (const r of records) { const k = r[field] || "Unknown"; grouped[k] = (grouped[k] || 0) + 1; }
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
