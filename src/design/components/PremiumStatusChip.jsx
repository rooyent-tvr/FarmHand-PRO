import { Chip } from "@mui/material";
import { componentSize } from "../tokens";

/**
 * Consistent status chip / badge.
 * @param {object} props
 * @param {string} props.label
 * @param {"success"|"warning"|"error"|"info"|"default"} [props.color]
 * @param {"small"|"medium"} [props.size]
 */
export default function PremiumStatusChip({ label, color = "default", size = "small", sx, ...rest }) {
  return (
    <Chip
      label={label}
      size={size}
      color={color}
      sx={{
        fontWeight: 600,
        fontSize: "0.7rem",
        height: componentSize.chipSmall,
        ...sx,
      }}
      {...rest}
    />
  );
}
