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

import { buildReceipt, generateReceiptPdf } from "../../utils/receiptPdfGenerator";

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

export default function ReceiptDialog({ open, invoice, onClose }) {
  if (!invoice) return null;

  const receipt = buildReceipt(invoice);

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
              PAYMENT RECEIPT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {receipt.receiptNumber}
            </Typography>
          </Stack>

          {/* Amount + Status */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              bgcolor: "rgba(34,197,94,0.05)",
              borderRadius: 3,
              px: 3,
              py: 2,
              border: "1px solid",
              borderColor: "rgba(34,197,94,0.2)",
            }}
          >
            <Stack spacing={0}>
              <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.6rem", fontWeight: 700 }}>
                Amount Paid
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                R{receipt.amount.toFixed(2)}
              </Typography>
            </Stack>
            <Chip
              label={displayStatus(receipt.status)}
              color={receipt.status === "Completed" ? "success" : "default"}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Divider />

          {/* Receipt Information */}
          <Stack spacing={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Receipt Information
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Receipt Number" value={receipt.receiptNumber} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Linked Invoice" value={receipt.linkedInvoice} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Payment Date" value={formatDate(receipt.paymentDate)} />
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
                <ReceiptField label="Customer Name" value={receipt.customerName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Farm Name" value={receipt.farmName || "\u2014"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Email" value={receipt.email || "\u2014"} />
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
                <ReceiptField label="Plan" value={receipt.plan} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Billing Cycle" value={receipt.billingCycle} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Payment Provider" value={receipt.paymentProvider} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReceiptField label="Payment Reference" value={receipt.paymentReference || "\u2014"} wrap />
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
      </DialogActions>
    </Dialog>
  );
}

function ReceiptField({ label, value, wrap }) {
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
