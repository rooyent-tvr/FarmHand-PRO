import { jsPDF } from "jspdf";

/**
 * ============================================================
 * Invoice PDF Generator
 * Sprint 42.6 — Phase 5
 *
 * Generates a professional downloadable PDF invoice using jsPDF.
 * Accepts a complete invoice object from invoiceService.
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

/**
 * Generates and downloads a professional PDF invoice.
 *
 * @param {object} invoice - Complete invoice object from generateInvoice()
 * @throws {Error} If PDF generation fails
 */
export function generateInvoicePdf(invoice) {
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
  let y = 25;

  // Colors
  const primaryColor = [15, 23, 42]; // slate-900
  const secondaryColor = [100, 116, 139]; // slate-500
  const accentColor = [99, 102, 241]; // indigo-500
  const dividerColor = [226, 232, 240]; // slate-200

  // -----------------------------------------------------------------------
  // Header: FELDRIX + TAX INVOICE
  // -----------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.text("FELDRIX", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text("TAX INVOICE", pageWidth / 2, y, { align: "center" });

  y += 12;
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Invoice Meta
  // -----------------------------------------------------------------------
  y += 10;
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
  doc.text(invoice.status || "Completed", margin + 120, y);

  y += 12;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Bill To
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("BILL TO", margin, y);

  y += 7;
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

  y += 6;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Subscription Details
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("SUBSCRIPTION", margin, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
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

  y += 6;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Payment Details
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT DETAILS", margin, y);

  y += 8;
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
  y += 10;
  doc.setFillColor(248, 250, 252); // slate-50
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
  y = doc.internal.pageSize.getHeight() - 30;

  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("Thank you for choosing Feldrix.", pageWidth / 2, y, { align: "center" });

  y += 4.5;
  doc.text("www.feldrix.com", pageWidth / 2, y, { align: "center" });

  // -----------------------------------------------------------------------
  // Download
  // -----------------------------------------------------------------------
  const filename = `${invoice.invoiceNumber || "Invoice"}.pdf`;
  doc.save(filename);
}

export default generateInvoicePdf;
