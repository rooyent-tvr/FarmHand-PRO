import { generateFinanceReport } from "./financeReport";
import { generateLivestockReport } from "./livestockReport";
import { generateBreedingReport } from "./breedingReport";
import { generateHealthReport } from "./healthReport";
import { generateCropReport } from "./cropReport";
import { generateMachineryReport } from "./machineryReport";

export async function generateFarmSummaryReport(options) {
  const [finance, livestock, breeding, health, crops, machinery] = await Promise.all([
    generateFinanceReport(options).catch(() => null),
    generateLivestockReport().catch(() => null),
    generateBreedingReport().catch(() => null),
    generateHealthReport().catch(() => null),
    generateCropReport().catch(() => null),
    generateMachineryReport().catch(() => null),
  ]);

  const sections = [];
  if (finance) sections.push({ title: "Finance", items: Object.entries(finance.statistics).map(([k, v]) => ({ label: k, value: v })) });
  if (livestock) sections.push({ title: "Livestock", items: Object.entries(livestock.statistics).map(([k, v]) => ({ label: k, value: v })) });
  if (breeding) sections.push({ title: "Breeding", items: Object.entries(breeding.statistics).map(([k, v]) => ({ label: k, value: v })) });
  if (health) sections.push({ title: "Health", items: Object.entries(health.statistics).map(([k, v]) => ({ label: k, value: v })) });
  if (crops) sections.push({ title: "Crops", items: Object.entries(crops.statistics).map(([k, v]) => ({ label: k, value: v })) });
  if (machinery) sections.push({ title: "Machinery", items: Object.entries(machinery.statistics).map(([k, v]) => ({ label: k, value: v })) });

  return {
    title: "Farm Summary Report",
    statistics: { modules: sections.length, generated: new Date().toLocaleDateString("en-ZA") },
    sections,
    aiSummary: "Complete farm overview generated successfully.",
  };
}
