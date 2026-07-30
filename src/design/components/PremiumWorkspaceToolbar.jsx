import { InputAdornment, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { radius } from "../tokens";

/**
 * Feldrix Workspace Toolbar
 *
 * Standard toolbar for all operational modules.
 *
 * LEFT:  Primary action button + View toggle
 * RIGHT: Search field + future filters
 *
 * @param {object} props
 * @param {React.ReactNode} [props.primaryAction] - Add button (e.g. + Add Animal)
 * @param {React.ReactNode} [props.viewToggle] - Table/Cards toggle
 * @param {string} [props.searchPlaceholder] - Search input placeholder
 * @param {string} [props.searchValue] - Controlled search value
 * @param {function} [props.onSearchChange] - Search change handler
 * @param {React.ReactNode} [props.extraLeft] - Additional left-side controls
 * @param {React.ReactNode} [props.extraRight] - Additional right-side controls (filters)
 */
export default function PremiumWorkspaceToolbar({
  primaryAction,
  viewToggle,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  extraLeft,
  extraRight,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      sx={{ mb: 2 }}
    >
      {/* Left side */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        {primaryAction}
        {viewToggle}
        {extraLeft}
      </Stack>

      {/* Right side */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        {onSearchChange && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 260 },
              "& .MuiOutlinedInput-root": { borderRadius: radius.input },
            }}
          />
        )}
        {extraRight}
      </Stack>
    </Stack>
  );
}
