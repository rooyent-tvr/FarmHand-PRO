import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { AttachMoney } from "@mui/icons-material";

function CostCard({ title, value }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, bgcolor: "#f5f5f5" }}>
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
        >
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function RunningCosts({ serviceHistory = [] }) {
  const costs = serviceHistory.map((s) => Number(s.cost || 0));
  const totalCost = costs.reduce((sum, c) => sum + c, 0);
  const serviceCount = serviceHistory.length;
  const averageCost = serviceCount > 0 ? Math.round(totalCost / serviceCount) : 0;
  const highestCost = costs.length > 0 ? Math.max(...costs) : 0;
  const lastCost = costs.length > 0 ? costs[0] : 0;

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          💰 Running Costs
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Cost summary calculated from service history.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {serviceCount === 0 ? (
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, p: 3, textAlign: "center" }}
          >
            <AttachMoney sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              No service records to calculate costs from.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 4 }}>
              <CostCard
                title="Total Cost"
                value={`R${totalCost.toLocaleString()}`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <CostCard
                title="Services"
                value={serviceCount}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <CostCard
                title="Average Cost"
                value={`R${averageCost.toLocaleString()}`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <CostCard
                title="Highest Cost"
                value={`R${highestCost.toLocaleString()}`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <CostCard
                title="Last Service Cost"
                value={`R${lastCost.toLocaleString()}`}
              />
            </Grid>
          </Grid>
        )}

      </CardContent>
    </Card>
  );
}
