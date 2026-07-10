import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";

import { exportFarmReport } from "../../utils/pdfExport";
import { exportFarmExcel } from "../../utils/excelExport";
import { exportFarmCSV } from "../../utils/csvExport";

export default function ExportCenter({
  report,
}) {
  function exportPDF() {
    exportFarmReport(report);
  }

  function exportExcel() {
    exportFarmExcel(report);
  }

  function exportCSV() {
    exportFarmCSV(report);
  }

  const buttonStyle = (color) => ({
    background: color,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 12,
    padding: "14px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    transition: "all .2s ease",
  });

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        marginTop: 30,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        📄 Export Centre
      </h2>

      <p
        style={{
          color: "#64748B",
          marginBottom: 24,
        }}
      >
        Export your complete farm records in
        professional formats for accountants,
        veterinarians, banks, insurance companies
        or your own archives.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <button
          onClick={exportPDF}
          style={buttonStyle("#DC2626")}
        >
          <FaFilePdf size={22} />
          Export PDF
        </button>

        <button
          onClick={exportExcel}
          style={buttonStyle("#16A34A")}
        >
          <FaFileExcel size={22} />
          Export Excel
        </button>

        <button
          onClick={exportCSV}
          style={buttonStyle("#2563EB")}
        >
          <FaFileCsv size={22} />
          Export CSV
        </button>
      </div>
    </div>
  );
}
