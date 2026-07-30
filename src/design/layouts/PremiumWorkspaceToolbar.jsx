import { Stack } from "@mui/material";

/**
 * Feldrix Workspace Toolbar
 *
 * Standard toolbar for operational modules.
 * Left: Primary action + view toggle
 * Right: Search / filters (future)
 *
 * @param {object} props
 * @param {React.ReactNode} props.left - Left-side controls (buttons, toggles)
 * @param {React.ReactNode} [props.right] - Right-side controls (search, filters)
 */
export default function PremiumWorkspaceToolbar({ left, right }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      sx={{ mb: 2.5 }}
    >
      {left && (
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {left}
        </Stack>
      )}
      {right && (
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {right}
        </Stack>
      )}
    </Stack>
  );
}
