import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { getInvoiceData } from "../../services/invoiceService";
import { generateInvoicePdf } from "../../utils/invoicePdfGenerator";
import { generateReceiptPdf } from "../../utils/receiptPdfGenerator";
import InvoiceDialog from "./InvoiceDialog";
import ReceiptDialog from "./ReceiptDialog";

export default function BillingHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInvoiceData();
        setInvoices(data);
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleDownload(invoice) {
    generateInvoicePdf(invoice).catch((err) => {
      console.error("PDF generation failed:", err);
      alert("Unable to generate invoice.");
    });
  }

  function handleDownloadReceipt(invoice) {
    generateReceiptPdf(invoice).catch((err) => {
      console.error("Receipt generation failed:", err);
      alert("Unable to generate receipt.");
    });
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(99,102,241,0.1)",
                }}
              >
                <ReceiptLongIcon sx={{ color: "#6366f1", fontSize: 22 }} />
              </Box>
              <Stack spacing={0}>
                <Typography variant="h6" fontWeight={700}>
                  Billing History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View all invoices and payment records
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Content */}
            {loading ? (
              <Stack alignItems="center" py={4}>
                <CircularProgress size={32} />
              </Stack>
            ) : invoices.length === 0 ? (
              <Stack alignItems="center" py={4} spacing={1}>
                <ReceiptLongIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary" fontWeight={500}>
                  No invoices yet
                </Typography>
                <Typography variant="body2" color="text.disabled" textAlign="center">
                  Invoices will appear here after your first payment.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0} divider={<Divider />}>
                {invoices.map((invoice) => (
                  <Stack
                    key={invoice.invoiceNumber}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                    sx={{ py: 2 }}
                  >
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={700}>
                        {invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.invoiceDate
                          ? new Date(invoice.invoiceDate).toLocaleDateString("en-ZA", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "\u2014"}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="body2" fontWeight={700}>
                        R{invoice.amount.toFixed(2)}
                      </Typography>
                      <Chip
                        label={invoice.status}
                        size="small"
                        color={invoice.status === "Completed" ? "success" : "default"}
                        sx={{ fontWeight: 600, fontSize: "0.7rem", height: 24 }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                        onClick={() => setSelectedInvoice(invoice)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          px: 1.5,
                          minWidth: 0,
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleDownload(invoice)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          px: 1.5,
                          minWidth: 0,
                        }}
                      >
                        PDF
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<ReceiptIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleDownloadReceipt(invoice)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          px: 1.5,
                          minWidth: 0,
                        }}
                      >
                        Receipt
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <InvoiceDialog
        open={!!selectedInvoice}
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  );
}
