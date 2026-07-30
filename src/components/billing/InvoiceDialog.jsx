import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import { generateInvoicePdf } from "../../utils/invoicePdfGenerator";
import { generateReceiptPdf } from "../../utils/receiptPdfGenerator";

function formatDate(date) {
  if (!date) return "\u2014";
  try {
    return new Date(date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "\u2014";
  }
}

function displayStatus(status) {
  if (status === "Completed") return "Paid";
  return status || "Paid";
}

export default function InvoiceDialog({ open, invoice, onClose }) {
  if (!invoice) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogContent sx={{ px: { xs: 3, md: 5 }, pt: 5, pb: 2 }}>
        <Stack spacing={4}>
          {/* Logo + Title */}
          <Stack alignItems="center" spacing={1.5}>
            <Box
              component="img"
              src="/branding/feldrix-logo-green.png"
              alt="Feldrix"
              sx={{ width: 140, height: "auto" }}
            />
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>
              TAX INVOICE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.invoiceNumber}
            </Typography>
          </Stack>

          {/* Amount + Status */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              bgcolor: "grey.50",
              borderRadius: 3,
              px: 3,
              py: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={0}>
              <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.6rem", fontWeight: 700 }}>
                Total Amount
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                R{invoice.amount.toFixed(2)}
              </Typography>
            </Stack>
            <Chip
              label={displayStatus(invoice.status)}
              color={invoice.status === "Completed" ? "success" : "default"}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Divider />

          {/* Invoice Information */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Invoice Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Invoice Number" value={invoice.invoiceNumber} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Customer Information */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Customer Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Customer Name" value={invoice.customerName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Farm Name" value={invoice.farmName || "\u2014"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Email" value={invoice.email || "\u2014"} />
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Subscription Information */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Subscription Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Plan" value={invoice.plan} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Billing Cycle" value={invoice.billingCycle} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Renewal Date" value={formatDate(invoice.renewalDate)} />
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          {/* Payment Information */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Payment Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Payment Provider" value={invoice.paymentProvider} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InvoiceField label="Payment Reference" value={invoice.paymentReference || "\u2014"} wrap />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 3, md: 5 }, pb: 4, pt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={() => {
            generateReceiptPdf(invoice).catch(() => alert("Unable to generate receipt."));
          }}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}
        >
          Download Receipt
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => {
            generateInvoicePdf(invoice).catch(() => alert("Unable to generate invoice."));
          }}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}
        >
          Download Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InvoiceField({ label, value, wrap }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.6rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={wrap ? { wordBreak: "break-all" } : undefined}>
        {value}
      </Typography>
    </Stack>
  );
}
