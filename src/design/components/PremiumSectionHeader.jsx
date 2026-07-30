import { Divider, Stack, Typography } from "@mui/material";
import { spacing, iconSize } from "../tokens";

/**
 * Consistent section header with icon, title, and optional subtitle.
 * @param {object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.action] - Right-aligned element (chip, button)
 * @param {boolean} [props.divider] - Show divider below
 */
export default function PremiumSectionHeader({ icon, title, subtitle, action, divider = true }) {
  return (
    <>
      <Stack direction="row" spacing={spacing.iconGap} alignItems="center" sx={{ mb: divider ? 1.5 : 0 }}>
        {icon}
        <Stack spacing={0} sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        {action}
      </Stack>
      {divider && <Divider sx={{ mb: spacing.dividerMargin }} />}
    </>
  );
}
