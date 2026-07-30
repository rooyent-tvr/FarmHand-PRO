import { jsPDF } from "jspdf";

/**
 * ============================================================
 * Receipt PDF Generator
 * Sprint 42.6 — Phase 6
 *
 * Generates a professional downloadable payment receipt using jsPDF.
 * Accepts a receipt object derived from an invoice/payment.
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
 * Derives a deterministic receipt number from an invoice/payment object.
 * Format: RCT-YYYY-XXXXXX
 *
 * @param {object} invoice - Invoice object (uses transactionId or paymentReference)
 * @returns {string}
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
 *
 * @param {object} invoice - Complete invoice object from invoiceService
 * @returns {object} Receipt object
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

/**
 * Generates and downloads a professional receipt PDF.
 *
 * @param {object} invoice - Complete invoice object from invoiceService
 * @throws {Error} If PDF generation fails
 */
export function generateReceiptPdf(invoice) {
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
  let y = 25;

  // Colors
  const primaryColor = [15, 23, 42];
  const secondaryColor = [100, 116, 139];
  const accentColor = [34, 197, 94]; // green-500
  const dividerColor = [226, 232, 240];

  // -----------------------------------------------------------------------
  // Header
  // -----------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.text("FELDRIX", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT RECEIPT", pageWidth / 2, y, { align: "center" });

  y += 12;
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Receipt Meta
  // -----------------------------------------------------------------------
  y += 10;
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
  doc.text(receipt.status || "Completed", margin + 120, y);

  y += 12;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Customer
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("CUSTOMER", margin, y);

  y += 7;
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

  y += 6;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Subscription
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text("SUBSCRIPTION", margin, y);

  y += 8;
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

  y += 6;
  doc.setDrawColor(...dividerColor);
  doc.line(margin, y, pageWidth - margin, y);

  // -----------------------------------------------------------------------
  // Payment
  // -----------------------------------------------------------------------
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT", margin, y);

  y += 8;
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
  y += 10;
  doc.setFillColor(240, 253, 244); // green-50
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
  const filename = `${receipt.receiptNumber}.pdf`;
  doc.save(filename);
}

export default generateReceiptPdf;
