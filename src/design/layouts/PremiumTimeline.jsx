import {
  alpha,
  Box,
  ButtonBase,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { componentSize, transitions } from "../tokens";

/**
 * Reusable timeline row component.
 * Used across Animal Health, Breeding, Planner, and Notification timelines.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Event icon
 * @param {string} props.iconColor - Theme color for icon
 * @param {string} props.title - Primary text
 * @param {string} [props.subtitle] - Secondary text
 * @param {string} [props.chipLabel] - Status chip text
 * @param {string} [props.chipColor] - Chip MUI color
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.showChevron] - Show right chevron (default true)
 */
export function PremiumTimelineRow({ icon, iconColor, title, subtitle, chipLabel, chipColor, onClick, showChevron = true }) {
  const theme = useTheme();
  const { palette } = theme;

  const content = (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, px: 1.5, width: "100%" }}>
      <Box
        sx={{
          width: componentSize.timelineIcon,
          height: componentSize.timelineIcon,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(iconColor || palette.info.main, 0.1),
          color: iconColor || palette.info.main,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled">
            {subtitle}
          </Typography>
        )}
      </Stack>

      {chipLabel && (
        <Chip
          label={chipLabel}
          size="small"
          color={chipColor || "default"}
          sx={{ fontWeight: 700, fontSize: "0.65rem", height: 24, minWidth: 72, flexShrink: 0 }}
        />
      )}

      {showChevron && (
        <ChevronRightIcon sx={{ color: "text.disabled", fontSize: 20, flexShrink: 0 }} />
      )}
    </Stack>
  );

  if (onClick) {
    return (
      <ButtonBase
        onClick={onClick}
        sx={{
          width: "100%",
          borderRadius: 2,
          textAlign: "left",
          transition: transitions.hover,
          "&:hover": {
            bgcolor: "action.hover",
            boxShadow: `0 2px 8px ${alpha(palette.text.primary, 0.06)}`,
          },
        }}
      >
        {content}
      </ButtonBase>
    );
  }

  return <Box sx={{ width: "100%" }}>{content}</Box>;
}

/**
 * Timeline group header.
 * @param {object} props
 * @param {string} props.label - Group label (e.g. "OVERDUE", "TODAY")
 * @param {string} [props.color] - Label color
 */
export function PremiumTimelineGroup({ label, color }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{
        color: color || "text.disabled",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontSize: "0.65rem",
      }}
    >
      {label}
    </Typography>
  );
}

/**
 * Timeline container with grouped rows.
 * @param {object} props
 * @param {React.ReactNode} props.children - PremiumTimelineGroup + PremiumTimelineRow elements
 */
export default function PremiumTimeline({ children }) {
  return (
    <Stack spacing={2.5}>
      {children}
    </Stack>
  );
}
