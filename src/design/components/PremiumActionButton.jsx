import { Button } from "@mui/material";
import { radius, transitions } from "../tokens";

/**
 * Standardised action button.
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} [props.startIcon]
 * @param {string} [props.variant] - "contained" | "outlined"
 * @param {string} [props.color]
 * @param {string} [props.size] - "small" | "medium"
 * @param {function} props.onClick
 * @param {boolean} [props.fullWidth]
 * @param {object} [props.sx]
 */
export default function PremiumActionButton({ label, startIcon, variant = "outlined", color, size = "small", onClick, fullWidth, sx, ...rest }) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: size === "small" ? "0.78rem" : "0.85rem",
        borderRadius: radius.button,
        px: 2,
        py: 0.75,
        transition: transitions.hover,
        ...sx,
      }}
      {...rest}
    >
      {label}
    </Button>
  );
}
