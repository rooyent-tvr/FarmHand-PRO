import { Grid, Stack } from "@mui/material";
import { spacing } from "../tokens";

/**
 * Two-column workspace layout.
 * Left: primary content. Right: optional sidebar.
 * Responsive: stacks on mobile.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Primary content (left)
 * @param {React.ReactNode} [props.sidebar] - Sidebar content (right)
 * @param {number} [props.sidebarWidth] - Sidebar md columns (default 4)
 */
export default function PremiumWorkspace({ children, sidebar, sidebarWidth = 4 }) {
  if (!sidebar) {
    return (
      <Stack spacing={spacing.sectionGap}>
        {children}
      </Stack>
    );
  }

  const mainWidth = 12 - sidebarWidth;

  return (
    <Grid container spacing={spacing.cardGap}>
      <Grid item xs={12} md={mainWidth}>
        <Stack spacing={spacing.sectionGap}>
          {children}
        </Stack>
      </Grid>
      <Grid item xs={12} md={sidebarWidth}>
        <Stack spacing={spacing.sectionGap}>
          {sidebar}
        </Stack>
      </Grid>
    </Grid>
  );
}
