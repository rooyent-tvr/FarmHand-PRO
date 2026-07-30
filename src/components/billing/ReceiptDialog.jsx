import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ReceiptIcon from "@mui/icons-material/Receipt";
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

export default function ReceiptDialog({ open, invoice, onClose }) {
  if (!invoice) return null;

  const receipt = buildReceipt(invoice);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ pt: 4, px: 4, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ReceiptIcon sx={{ color: "#16a34a", fontSize: 28 }} />
          <Stack spacing={0}>
            <Typography variant="h6" fontWeight={700}>
              Payment Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {receipt.receiptNumber}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
        <Stack spacing={3}>
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
              label={receipt.status}
              color={receipt.status === "Completed" ? "success" : "default"}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Divider />

          {/* Details grid */}
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
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Payment Provider" value={receipt.paymentProvider} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Customer Name" value={receipt.customerName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Farm Name" value={receipt.farmName || "\u2014"} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Email" value={receipt.email || "\u2014"} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Plan" value={receipt.plan} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Billing Cycle" value={receipt.billingCycle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReceiptField label="Payment Reference" value={receipt.paymentReference || "\u2014"} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1 }}>
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
            try {
              generateReceiptPdf(invoice);
            } catch {
              alert("Unable to generate receipt.");
            }
          }}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}
        >
          Download Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ReceiptField({ label, value }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontSize: "0.6rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}
