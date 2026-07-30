import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { radius, elevation, spacing } from "../tokens";

/**
 * Reusable content section card with title, subtitle, action, and children.
 *
 * @param {object} props
 * @param {string} [props.title] - Section title
 * @param {string} [props.subtitle] - Section description
 * @param {React.ReactNode} [props.icon] - Leading icon
 * @param {React.ReactNode} [props.action] - Right-aligned action element
 * @param {boolean} [props.flat] - No elevation
 * @param {boolean} [props.noPadding] - Remove internal padding
 * @param {React.ReactNode} props.children - Section content
 */
export default function PremiumContentSection({ title, subtitle, icon, action, flat, noPadding, children }) {
  return (
    <Card
      elevation={flat ? elevation.flat : elevation.card}
      sx={{
        borderRadius: radius.card,
        bgcolor: "background.paper",
        ...(flat && { border: "1px solid", borderColor: "divider" }),
      }}
    >
      <CardContent sx={{ p: noPadding ? 0 : spacing.cardPadding }}>
        <Stack spacing={spacing.dividerMargin}>
          {title && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
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
              <Divider />
            </>
          )}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
