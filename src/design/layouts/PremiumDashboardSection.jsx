import { Box, Stack, Typography } from "@mui/material";
import { spacing } from "../tokens";

/**
 * Dashboard section wrapper with title, description, and optional action.
 * Used for Operations Centre, Farm Overview, Quick Actions, etc.
 *
 * @param {object} props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {React.ReactNode} [props.action] - Action button/element
 * @param {React.ReactNode} props.children - Section content
 */
export default function PremiumDashboardSection({ title, description, action, children }) {
  return (
    <Box>
      {title && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Stack spacing={0.25}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Stack>
          {action}
        </Stack>
      )}
      <Stack spacing={spacing.sectionGap}>
        {children}
      </Stack>
    </Box>
  );
}
