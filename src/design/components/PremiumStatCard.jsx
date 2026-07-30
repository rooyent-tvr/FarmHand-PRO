import { Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { radius, elevation, transitions, spacing, componentSize, typography, iconSize } from "../tokens";

/**
 * KPI / stat card used across Intelligence modules.
 * @param {object} props
 * @param {string} props.label - Metric label
 * @param {string|number} props.value - Metric value
 * @param {string} [props.subtitle] - Secondary text
 * @param {React.ReactNode} props.icon - MUI icon element
 * @param {string} props.iconBg - Icon background color (alpha string)
 * @param {string} props.iconColor - Icon color
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.danger] - Red accent
 * @param {boolean} [props.amber] - Amber accent
 */
export default function PremiumStatCard({ label, value, subtitle, icon, iconBg, iconColor, onClick, danger, amber, sx }) {
  const accentColor = danger ? "rgba(239,68,68," : amber ? "rgba(245,158,11," : null;

  return (
    <Card
      elevation={elevation.flat}
      onClick={onClick}
      sx={{
        borderRadius: radius.cardLarge,
        border: "1px solid",
        borderColor: danger ? "rgba(239,68,68,0.25)" : amber ? "rgba(245,158,11,0.25)" : "divider",
        height: "100%",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: transitions.entrance,
        "&:hover": {
          boxShadow: accentColor ? `0 12px 32px ${accentColor}0.08)` : elevation.cardHover,
          transform: "translateY(-3px)",
          borderColor: danger ? "rgba(239,68,68,0.4)" : amber ? "rgba(245,158,11,0.4)" : "transparent",
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={2.5} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: componentSize.kpiIcon,
              height: componentSize.kpiIcon,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: iconBg,
              color: iconColor,
            }}
          >
            {icon}
          </Box>

          <Stack spacing={0.75} sx={{ mt: "auto" }}>
            <Typography
              variant="caption"
              sx={{
                color: danger ? "error.main" : amber ? "#d97706" : "text.disabled",
                ...typography.metricLabel,
              }}
            >
              {label}
            </Typography>
            <Typography
              fontWeight={800}
              sx={{
                ...typography.metricValue,
                color: danger ? "error.main" : amber ? "#d97706" : "text.primary",
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography sx={{ ...typography.metricSubtitle, mt: 0.25, color: danger ? "error.light" : amber ? "#b45309" : "text.secondary" }}>
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
