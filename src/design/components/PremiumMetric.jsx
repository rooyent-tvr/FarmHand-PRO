import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { componentSize, typography } from "../tokens";

/**
 * Circular score metric with progress bar.
 * Used by all Intelligence Health Score components.
 * @param {object} props
 * @param {number} props.score - 0-100
 * @param {string} props.status - Text status label
 * @param {string} props.color - Resolved color value
 */
export default function PremiumMetric({ score, status, color }) {
  const theme = useTheme();

  return (
    <Stack spacing={2.5} alignItems="center">
      <Box
        sx={{
          width: componentSize.scoreCircle,
          height: componentSize.scoreCircle,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `${componentSize.scoreCircleBorder}px solid ${color}`,
          bgcolor: `${color}18`,
        }}
      >
        <Typography variant="h3" fontWeight={800} sx={{ color }}>
          {score}
        </Typography>
      </Box>

      <Typography variant="body1" fontWeight={700} sx={{ color }}>
        {status}
      </Typography>

      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: componentSize.progressBar,
            borderRadius: componentSize.progressBar / 2,
            bgcolor: theme.palette.action.hover,
            "& .MuiLinearProgress-bar": {
              borderRadius: componentSize.progressBar / 2,
              bgcolor: color,
            },
          }}
        />
      </Box>
    </Stack>
  );
}
