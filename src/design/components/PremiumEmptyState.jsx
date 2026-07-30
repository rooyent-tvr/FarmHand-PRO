import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * Positive empty state used across Intelligence modules.
 * @param {object} props
 * @param {string} [props.title] - Default "Excellent!"
 * @param {string} props.message
 * @param {React.ReactNode} [props.icon] - Override default icon
 */
export default function PremiumEmptyState({ title = "Excellent!", message, icon }) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 3 }}>
      {icon || <CheckCircleIcon sx={{ fontSize: 44, color: "success.main" }} />}
      <Typography variant="h6" fontWeight={700} color="success.main">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ lineHeight: 1.6, maxWidth: 300 }}>
        {message}
      </Typography>
    </Stack>
  );
}
