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

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BillingHistory({ payments = [] }) {
  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongIcon color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Billing History
            </Typography>
          </Stack>

          <Chip
            label={`${payments.length} Payment${
              payments.length === 1 ? "" : "s"
            }`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {payments.length === 0 ? (
          <Stack spacing={2}>
            <Alert
              icon={<InfoOutlinedIcon />}
              severity="info"
            >
              No payments have been recorded yet.
            </Alert>

            <Typography color="text.secondary">
              Once your FarmHand PRO subscription becomes active,
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
              <Card
                key={payment.id}
                variant="outlined"
              >
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack spacing={0.5}>
                      <Typography fontWeight={600}>
                        {formatDate(payment.paid_at)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Invoice #
                        {payment.invoice_number || "-"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Provider: {payment.provider}
                      </Typography>

                      {payment.transaction_id && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Transaction: {payment.transaction_id}
                        </Typography>
                      )}
                    </Stack>

                    <Stack
                      spacing={1}
                      alignItems={{
                        xs: "flex-start",
                        sm: "flex-end",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {payment.currency || "ZAR"}{" "}
                        {Number(payment.amount).toFixed(2)}
                      </Typography>

                      <Chip
                        size="small"
                        label={payment.status}
                        color={
                          payment.status === "Completed"
                            ? "success"
                            : payment.status === "Pending"
                            ? "warning"
                            : payment.status === "Failed"
                            ? "error"
                            : "default"
                        }
                      />

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        disabled
                      >
                        Invoice
                      </Button>
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
