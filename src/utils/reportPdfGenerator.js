import { jsPDF } from "jspdf";

/**
 * ============================================================
 * Report PDF Generator
 * Sprint 45 — Phase 7
 *
 * Generates a professional branded PDF from a generated report object.
 * Reuses branding patterns from invoicePdfGenerator.js
 * ============================================================
 */

function formatDate(iso) {
  if (!iso) return "\u2014";
  try {
    return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "\u2014";
  }
}

async function loadLogoAsBase64() {
  try {
    const response = await fetch("/branding/feldrix-logo-green.png");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawFooter(doc, pageWidth, margin) {
  const secondaryColor = [100, 116, 139];
  const dividerColor = [226, 232, 240];
  let y = doc.internal.pageSize.getHeight() - 28;

  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...secondaryColor);
  doc.text("Feldrix \u2014 Smart Farm Management Platform", pageWidth / 2, y, { align: "center" });
  y += 3.5;
  doc.text("www.feldrix.com | support@feldrix.com", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.setFontSize(6);
  doc.text("\u00A9 2026 Feldrix. All rights reserved.", pageWidth / 2, y, { align: "center" });
}

/**
 * Generates and downloads a branded PDF report.
 *
 * @param {object} report - Generated report object from reportGenerator.js
 */
export async function generateReportPdf(report) {
  if (!report) throw new Error("No report data provided.");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const primaryColor = [15, 23, 42];
  const secondaryColor = [100, 116, 139];
  const accentColor = [46, 125, 50]; // Green accent for Feldrix
  const dividerColor = [226, 232, 240];

  let y = 15;

  // Helper: check if we need a new page
  function checkPage(needed = 20) {
    if (y + needed > pageHeight - 35) {
      drawFooter(doc, pageWidth, margin);
      doc.addPage();
      y = 15;
    }
  }

  // -----------------------------------------------------------------------
  // Logo
  // -----------------------------------------------------------------------
  if (report.options?.includeBranding) {
    const logoData = await loadLogoAsBase64();
    if (logoData) {
      doc.addImage(logoData, "PNG", (pageWidth - 45) / 2, y, 45, 15);
      y += 22;
    }
  }

  // -----------------------------------------------------------------------
  // Title
  // -----------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(report.title || "Farm Report", pageWidth / 2, y, { align: "center" });

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text(`${formatDate(report.period?.from)} \u2014 ${formatDate(report.period?.to)}`, pageWidth / 2, y, { align: "center" });

  y += 5;
  doc.text(`Generated: ${formatDate(report.generatedDate)}`, pageWidth / 2, y, { align: "center" });

  y += 8;
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Statistics
  // -----------------------------------------------------------------------
  if (report.statistics) {
    y += 10;
    checkPage(30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text("KEY METRICS", margin, y);
    y += 8;

    const entries = Object.entries(report.statistics);
    const colWidth = contentWidth / Math.min(entries.length, 4);

    for (let i = 0; i < entries.length; i++) {
      const col = i % 4;
      if (i > 0 && col === 0) y += 14;
      checkPage(14);

      const x = margin + col * colWidth;
      const [key, value] = entries[i];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...secondaryColor);
      doc.text(key.replace(/([A-Z])/g, " $1").trim().toUpperCase(), x, y);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.text(String(value), x, y + 5);
    }

    y += 18;
    doc.setDrawColor(...dividerColor);
    doc.line(margin, y, pageWidth - margin, y);
  }

  // -----------------------------------------------------------------------
  // Sections
  // -----------------------------------------------------------------------
  if (report.sections?.length > 0) {
    for (const section of report.sections) {
      y += 10;
      checkPage(20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...accentColor);
      doc.text(section.title.toUpperCase(), margin, y);
      y += 7;

      if (section.items?.length > 0) {
        for (const item of section.items) {
          checkPage(8);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...secondaryColor);
          doc.text(item.label, margin + 4, y);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...primaryColor);
          doc.text(String(item.value), pageWidth - margin, y, { align: "right" });
          y += 6;
        }
      }

      y += 4;
      doc.setDrawColor(...dividerColor);
      doc.line(margin, y, pageWidth - margin, y);
    }
  }

  // -----------------------------------------------------------------------
  // AI Summary
  // -----------------------------------------------------------------------
  if (report.aiSummary && report.options?.includeAiSummary) {
    y += 10;
    checkPage(25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text("AI SUMMARY", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    const lines = doc.splitTextToSize(report.aiSummary, contentWidth - 8);
    for (const line of lines) {
      checkPage(6);
      doc.text(line, margin + 4, y);
      y += 5;
    }
  }

  // -----------------------------------------------------------------------
  // Footer
  // -----------------------------------------------------------------------
  drawFooter(doc, pageWidth, margin);

  // -----------------------------------------------------------------------
  // Download
  // -----------------------------------------------------------------------
  const filename = report.emailFilename ? `${report.emailFilename}.pdf` : `${report.title?.replace(/\s+/g, "_") || "Report"}.pdf`;
  doc.save(filename);
}

export default generateReportPdf;
