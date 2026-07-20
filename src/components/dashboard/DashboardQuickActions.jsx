import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const actions = [
  { label: "Add Animal", icon: "🐄", route: "/livestock" },
  { label: "Add Crop", icon: "🌾", route: "/crops" },
  { label: "New Task", icon: "📋", route: "/planner" },
  { label: "Add Machine", icon: "🚜", route: "/machinery" },
  { label: "Record Expense", icon: "💰", route: "/finance" },
  { label: "View Reports", icon: "📊", route: "/reports" },
];

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, display: "block", fontSize: "0.7rem" }}>
        ⚡ Quick Actions
      </Typography>

      <Grid container spacing={1.5}>
        {actions.map((action) => (
          <Grid key={action.label} size={{ xs: 4, sm: 2 }}>
            <Card
              elevation={0}
              onClick={() => navigate(action.route)}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-3px)",
                  borderColor: "success.main",
                  "& .qa-icon": { transform: "scale(1.15)" },
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack alignItems="center" spacing={0.75}>
                  <Typography className="qa-icon" sx={{ fontSize: 30, transition: "transform 0.2s ease" }}>
                    {action.icon}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                    {action.label}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
