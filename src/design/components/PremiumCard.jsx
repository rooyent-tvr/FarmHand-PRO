import { Card, CardContent } from "@mui/material";
import { radius, elevation, transitions, spacing } from "../tokens";

/**
 * Standard Feldrix card wrapper.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.flat] - No elevation
 * @param {boolean} [props.hoverable] - Lift on hover
 * @param {number} [props.minHeight]
 * @param {object} [props.sx] - Additional styles
 */
export default function PremiumCard({ children, flat, hoverable, minHeight, sx, ...rest }) {
  return (
    <Card
      elevation={flat ? elevation.flat : elevation.card}
      sx={{
        borderRadius: radius.card,
        bgcolor: "background.paper",
        ...(minHeight && { minHeight, display: "flex", flexDirection: "column" }),
        ...(hoverable && {
          transition: transitions.hover,
          cursor: "pointer",
          "&:hover": {
            boxShadow: elevation.cardHover,
            transform: "translateY(-3px)",
            borderColor: "transparent",
          },
        }),
        ...sx,
      }}
      {...rest}
    >
      <CardContent
        sx={{
          p: spacing.cardPadding,
          ...(minHeight && { flex: 1, display: "flex", flexDirection: "column" }),
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
