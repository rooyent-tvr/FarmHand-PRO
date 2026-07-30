import { Box, Stack, Typography } from "@mui/material";
import { spacing } from "../tokens";

/**
 * Feldrix standard page layout.
 * Every page should wrap content in this component for consistent structure.
 *
 * @param {object} props
 * @param {string} props.title - Page title
 * @param {string} [props.subtitle] - Page description
 * @param {React.ReactNode} [props.icon] - Page icon (MUI icon element)
 * @param {React.ReactNode} [props.actions] - Primary action buttons (top-right)
 * @param {React.ReactNode} [props.toolbar] - Optional toolbar below header
 * @param {boolean} [props.loading] - Show loading state
 * @param {React.ReactNode} props.children - Page content
 */
export default function PremiumPageLayout({ title, subtitle, icon, actions, toolbar, loading, children }) {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack spacing={spacing.sectionGap}>
        {/* Page Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon && (
              <Box sx={{ display: "flex", alignItems: "center", color: "primary.main" }}>
                {icon}
              </Box>
            )}
            <Stack spacing={0.25}>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>

          {actions && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {actions}
            </Stack>
          )}
        </Stack>

        {toolbar}

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : (
          children
        )}
      </Stack>
    </Box>
  );
}
