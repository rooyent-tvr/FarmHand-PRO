import { jsPDF } from "jspdf";

/**
 * ============================================================
 * Invoice PDF Generator
 * Sprint 42.6 — Phase 5 + Sprint 42.7 Branding
 *
 * Generates a professional downloadable PDF invoice using jsPDF.
 * Includes Feldrix branding, logo, and professional footer.
 * ============================================================
 */

function formatDate(date) {
  if (!date) return "\u2014";
  try {
    return new Date(date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "\u2014";
  }
}

function formatCurrency(amount) {
  return `R${Number(amount || 0).toFixed(2)}`;
}

function displayStatus(status) {
  if (status === "Completed") return "Paid";
  return status || "Paid";
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
  let y = doc.internal.pageSize.getHeight() - 32;

  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...secondaryColor);
  doc.text("Smart Farm Management Platform", pageWidth / 2, y, { align: "center" });

  y += 3.5;
  doc.text("www.feldrix.com", pageWidth / 2, y, { align: "center" });

  y += 3.5;
  doc.text("support@feldrix.com", pageWidth / 2, y, { align: "center" });

  y += 4;
  doc.setFontSize(6);
  doc.text("\u00A9 2026 Feldrix. All rights reserved.", pageWidth / 2, y, { align: "center" });
}

/**
 * Generates and downloads a professional PDF invoice.
 *
 * @param {object} invoice - Complete invoice object from generateInvoice()
 * @throws {Error} If PDF generation fails
 */
export async function generateInvoicePdf(invoice) {
  if (!invoice) {
    throw new Error("No invoice data provided.");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  // Colors
  const primaryColor = [15, 23, 42];
  const secondaryColor = [100, 116, 139];
  const accentColor = [99, 102, 241];
  const dividerColor = [226, 232, 240];

  // -----------------------------------------------------------------------
  // Logo
  // -----------------------------------------------------------------------
  const logoData = await loadLogoAsBase64();
  if (logoData) {
    const logoWidth = 45;
    const logoHeight = 15;
    doc.addImage(logoData, "PNG", (pageWidth - logoWidth) / 2, y, logoWidth, logoHeight);
    y += logoHeight + 6;
  }

  // -----------------------------------------------------------------------
  // Header: TAX INVOICE
  // -----------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text("TAX INVOICE", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Invoice Meta
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");

  doc.text("Invoice Number", margin, y);
  doc.text("Invoice Date", margin + 60, y);
  doc.text("Status", margin + 120, y);

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);

  doc.text(invoice.invoiceNumber || "\u2014", margin, y);
  doc.text(formatDate(invoice.invoiceDate), margin + 60, y);
  doc.text(displayStatus(invoice.status), margin + 120, y);

  y += 10;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Bill To
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("BILL TO", margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);

  const billToLines = [
    invoice.customerName || "Feldrix Customer",
    invoice.farmName || null,
    invoice.email || null,
  ].filter(Boolean);

  for (const line of billToLines) {
    doc.text(line, margin, y);
    y += 5.5;
  }

  y += 5;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Subscription Details
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("SUBSCRIPTION", margin, y);

  y += 7;
  doc.setFontSize(9);

  const subDetails = [
    { label: "Plan", value: invoice.plan || "Pro" },
    { label: "Billing Cycle", value: invoice.billingCycle || "Monthly" },
    { label: "Renewal Date", value: formatDate(invoice.renewalDate) },
  ];

  for (const item of subDetails) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(item.label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(item.value, margin + 50, y);
    y += 6;
  }

  y += 5;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Payment Details
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT DETAILS", margin, y);

  y += 7;
  doc.setFontSize(9);

  const payDetails = [
    { label: "Amount Paid", value: formatCurrency(invoice.amount) },
    { label: "Payment Provider", value: invoice.paymentProvider || "PayFast" },
    { label: "Payment Reference", value: invoice.paymentReference || "\u2014" },
  ];

  for (const item of payDetails) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(item.label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(item.value, margin + 50, y);
    y += 6;
  }

  // -----------------------------------------------------------------------
  // Amount Highlight
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Total Paid", margin + 8, y + 11);

  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.text(formatCurrency(invoice.amount), pageWidth - margin - 8, y + 11, { align: "right" });

  // -----------------------------------------------------------------------
  // Footer
  // -----------------------------------------------------------------------
  drawFooter(doc, pageWidth, margin);

  // -----------------------------------------------------------------------
  // Download
  // -----------------------------------------------------------------------
  const filename = `${invoice.invoiceNumber || "Invoice"}.pdf`;
  doc.save(filename);
}

export default generateInvoicePdf;
