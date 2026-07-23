
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DownloadIcon from "@mui/icons-material/Download";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function BillingHistory({ payments = [] }) {
  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Billing History
            </Typography>
          </Stack>

          <Chip
            label={`${payments.length} Payment${payments.length === 1 ? "" : "s"}`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {payments.length === 0 ? (
          <Stack spacing={2}>
            <Alert icon={<InfoOutlinedIcon />} severity="info">
              No payments have been recorded yet.
            </Alert>

            <Typography color="text.secondary">
              Once your FarmHand PRO subscription is connected to a payment provider,
              your invoices and payment history will appear here.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled
            >
              Download Invoice
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {payments.map((payment) => (
              <Card key={payment.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <div>
                      <Typography fontWeight={600}>
                        {payment.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Invoice #{payment.invoice}
                      </Typography>
                    </div>

                    <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                      <Typography fontWeight={700}>
                        R{Number(payment.amount).toFixed(2)}
                      </Typography>
                      <Chip
                        size="small"
                        color={payment.status === "Paid" ? "success" : "warning"}
                        label={payment.status}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
