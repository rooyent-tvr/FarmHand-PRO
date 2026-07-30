import { CircularProgress, Stack, Typography } from "@mui/material";

/**
 * Consistent loading state for cards and sections.
 * @param {object} props
 * @param {string} [props.message]
 * @param {number} [props.size] - Spinner size
 */
export default function PremiumLoadingState({ message, size = 32 }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 4 }}>
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Stack>
  );
}
