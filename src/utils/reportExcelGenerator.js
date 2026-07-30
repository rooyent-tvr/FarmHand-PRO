import * as XLSX from "xlsx";

/**
 * ============================================================
 * Report Excel Generator
 * Sprint 45 — Phase 7
 *
 * Generates a formatted XLSX workbook from a generated report object.
 * ============================================================
 */

function formatDate(iso) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Generates and downloads an Excel workbook for the given report.
 *
 * @param {object} report - Generated report object from reportGenerator.js
 */
export function generateReportExcel(report) {
  if (!report) throw new Error("No report data provided.");

  const wb = XLSX.utils.book_new();

  // --- Summary Sheet ---
  const summaryRows = [
    [report.title || "Farm Report"],
    [`Period: ${formatDate(report.period?.from)} \u2014 ${formatDate(report.period?.to)}`],
    [`Generated: ${formatDate(report.generatedDate)}`],
    [],
    ["KEY METRICS"],
  ];

  if (report.statistics) {
    for (const [key, value] of Object.entries(report.statistics)) {
      summaryRows.push([key.replace(/([A-Z])/g, " $1").trim(), String(value)]);
    }
  }

  if (report.aiSummary && report.options?.includeAiSummary) {
    summaryRows.push([], ["AI SUMMARY"], [report.aiSummary]);
  }

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
  summaryWs["!cols"] = [{ wch: 30 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  // --- Section Sheets ---
  if (report.sections?.length > 0) {
    for (const section of report.sections) {
      const sectionRows = [[section.title], ["Label", "Value"]];
      if (section.items?.length > 0) {
        for (const item of section.items) {
          sectionRows.push([item.label, String(item.value)]);
        }
      }
      const sheetName = section.title.slice(0, 31); // Excel sheet name max 31 chars
      const ws = XLSX.utils.aoa_to_sheet(sectionRows);
      ws["!cols"] = [{ wch: 30 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  }

  // --- Download ---
  const filename = report.emailFilename ? `${report.emailFilename}.xlsx` : `${report.title?.replace(/\s+/g, "_") || "Report"}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export default generateReportExcel;
