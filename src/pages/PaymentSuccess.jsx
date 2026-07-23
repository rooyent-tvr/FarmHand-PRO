import {
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3} alignItems="center">
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 72 }}
          />

          <Typography variant="h4" fontWeight={700}>
            Payment Successful
          </Typography>

          <Typography color="text.secondary" align="center">
            Thank you for upgrading to FarmHand PRO.
            <br />
            Your payment has been received successfully.
          </Typography>

          <Divider flexItem />

          <Stack spacing={1} width="100%">
            <Typography>
              <strong>Subscription:</strong> FarmHand PRO
            </Typography>

            <Typography>
              <strong>Amount:</strong> R99.00
            </Typography>

            <Typography>
              <strong>Provider:</strong> PayFast
            </Typography>

            <Chip
              label="Active"
              color="success"
              sx={{ width: "fit-content" }}
            />
          </Stack>

          <Divider flexItem />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            width="100%"
          >
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/account")}
            >
              Return to Account
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
