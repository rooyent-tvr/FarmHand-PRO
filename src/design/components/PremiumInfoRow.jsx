import { Stack, Typography } from "@mui/material";

/**
 * Summary row with icon, label, and right-aligned value.
 * Used in Today's Summary sections across all Intelligence modules.
 * @param {object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} props.label
 * @param {string|number} props.value
 */
export default function PremiumInfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color="text.primary">
        {value}
      </Typography>
    </Stack>
  );
}
