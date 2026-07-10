function downloadCSV(filename, rows) {
  if (!rows || rows.length === 0) {
    alert(`No data available for ${filename}`);
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportFarmCSV(report) {
  downloadCSV(
    "FarmHand-Pro-Livestock.csv",
    report.animals || []
  );

  downloadCSV(
    "FarmHand-Pro-Finance.csv",
    report.finance || []
  );

  downloadCSV(
    "FarmHand-Pro-Breeding.csv",
    report.breeding || []
  );

  downloadCSV(
    "FarmHand-Pro-Health.csv",
    report.health || []
  );
}
