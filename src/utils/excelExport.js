import * as XLSX from "xlsx";

export function exportFarmExcel(report) {
  const workbook = XLSX.utils.book_new();

  const summary = [
    ["FarmHand PRO Report"],
    [""],
    ["Total Animals", report.totalAnimals],
    ["Total Income", report.totalIncome],
    ["Total Expenses", report.totalExpenses],
    ["Net Profit", report.netProfit],
  ];

  const summarySheet =
    XLSX.utils.aoa_to_sheet(summary);

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Summary"
  );

  const livestockSheet =
    XLSX.utils.json_to_sheet(
      report.animals || []
    );

  XLSX.utils.book_append_sheet(
    workbook,
    livestockSheet,
    "Livestock"
  );

  const financeSheet =
    XLSX.utils.json_to_sheet(
      report.finance || []
    );

  XLSX.utils.book_append_sheet(
    workbook,
    financeSheet,
    "Finance"
  );

  const breedingSheet =
    XLSX.utils.json_to_sheet(
      report.breeding || []
    );

  XLSX.utils.book_append_sheet(
    workbook,
    breedingSheet,
    "Breeding"
  );

  const healthSheet =
    XLSX.utils.json_to_sheet(
      report.health || []
    );

  XLSX.utils.book_append_sheet(
    workbook,
    healthSheet,
    "Health"
  );

  XLSX.writeFile(
    workbook,
    "FarmHand-Pro-Report.xlsx"
  );
}
