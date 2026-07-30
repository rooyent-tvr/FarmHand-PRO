import { Grid } from "@mui/material";
import { spacing } from "../tokens";

/**
 * Responsive KPI card grid.
 * Automatically distributes 1-6 cards evenly across breakpoints.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - PremiumStatCard elements
 * @param {number} [props.gap] - Override spacing between cards
 */
export default function PremiumKPIGrid({ children, gap }) {
  return (
    <Grid container spacing={gap ?? spacing.cardGap}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <Grid item xs={12} sm={6} md key={index}>
              {child}
            </Grid>
          ))
        : (
            <Grid item xs={12}>
              {children}
            </Grid>
          )
      }
    </Grid>
  );
}
