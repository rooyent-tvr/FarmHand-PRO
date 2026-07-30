import { jsPDF } from "jspdf";

/**
 * ============================================================
 * Receipt PDF Generator
 * Sprint 42.6 — Phase 6 + Sprint 42.7 Branding
 *
 * Generates a professional downloadable payment receipt using jsPDF.
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

/**
 * Derives a deterministic receipt number from an invoice/payment object.
 * Format: RCT-YYYY-XXXXXX
 */
export function getReceiptNumber(invoice) {
  if (!invoice) return "RCT-0000-000000";

  const date = invoice.invoiceDate ? new Date(invoice.invoiceDate) : new Date();
  const year = date.getFullYear();

  const id = invoice.transactionId || invoice.paymentReference || invoice.invoiceNumber || "";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const sequence = Math.abs(hash) % 1000000;

  return `RCT-${year}-${String(sequence).padStart(6, "0")}`;
}

/**
 * Builds a receipt object from an existing invoice object.
 */
export function buildReceipt(invoice) {
  if (!invoice) return null;

  return {
    receiptNumber: getReceiptNumber(invoice),
    linkedInvoice: invoice.invoiceNumber,
    paymentDate: invoice.invoiceDate,
    customerName: invoice.customerName,
    farmName: invoice.farmName,
    email: invoice.email,
    plan: invoice.plan,
    billingCycle: invoice.billingCycle,
    amount: invoice.amount,
    currency: invoice.currency || "ZAR",
    status: invoice.status,
    paymentProvider: invoice.paymentProvider,
    paymentReference: invoice.paymentReference,
  };
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
 * Generates and downloads a professional receipt PDF.
 *
 * @param {object} invoice - Complete invoice object from invoiceService
 * @throws {Error} If PDF generation fails
 */
export async function generateReceiptPdf(invoice) {
  if (!invoice) {
    throw new Error("No invoice data provided for receipt.");
  }

  const receipt = buildReceipt(invoice);

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
  const accentColor = [34, 197, 94];
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
  // Header
  // -----------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT RECEIPT", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Receipt Meta
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");

  doc.text("Receipt Number", margin, y);
  doc.text("Receipt Date", margin + 60, y);
  doc.text("Status", margin + 120, y);

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);

  doc.text(receipt.receiptNumber, margin, y);
  doc.text(formatDate(receipt.paymentDate), margin + 60, y);
  doc.text(displayStatus(receipt.status), margin + 120, y);

  y += 10;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Customer
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("CUSTOMER", margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);

  const customerLines = [
    receipt.customerName || "Feldrix Customer",
    receipt.farmName || null,
    receipt.email || null,
  ].filter(Boolean);

  for (const line of customerLines) {
    doc.text(line, margin, y);
    y += 5.5;
  }

  y += 5;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Subscription
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("SUBSCRIPTION", margin, y);

  y += 7;
  doc.setFontSize(9);

  const subDetails = [
    { label: "Plan", value: receipt.plan || "Pro" },
    { label: "Billing Cycle", value: receipt.billingCycle || "Monthly" },
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
  // Payment
  // -----------------------------------------------------------------------
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT", margin, y);

  y += 7;
  doc.setFontSize(9);

  const payDetails = [
    { label: "Amount Paid", value: formatCurrency(receipt.amount) },
    { label: "Payment Provider", value: receipt.paymentProvider || "PayFast" },
    { label: "Payment Reference", value: receipt.paymentReference || "\u2014" },
    { label: "Linked Invoice", value: receipt.linkedInvoice || "\u2014" },
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
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Total Paid", margin + 8, y + 11);

  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.text(formatCurrency(receipt.amount), pageWidth - margin - 8, y + 11, { align: "right" });

  // -----------------------------------------------------------------------
  // Footer
  // -----------------------------------------------------------------------
  drawFooter(doc, pageWidth, margin);

  // -----------------------------------------------------------------------
  // Download
  // -----------------------------------------------------------------------
  const filename = `${receipt.receiptNumber}.pdf`;
  doc.save(filename);
}

export default generateReceiptPdf;
