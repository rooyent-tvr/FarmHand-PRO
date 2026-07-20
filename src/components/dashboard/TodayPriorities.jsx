import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { PriorityHigh } from "@mui/icons-material";

export default function TodayPriorities({
  healthDue = 0,
  pregnant = 0,
  growing = 0,
  tasksDue = 0,
}) {
  const items = [
    {
      icon: "💉",
      label: "Health",
      value: healthDue,
      color: "error.main",
    },
    {
      icon: "🐂",
      label: "Breeding",
      value: pregnant,
      color: "warning.main",
    },
    {
      icon: "🌱",
      label: "Crops",
      value: growing,
      color: "success.main",
    },
    {
      icon: "📋",
      label: "Tasks",
      value: tasksDue,
      color: "primary.main",
    },
  ];

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
      }}
    >
      <CardContent sx={{ p: 3 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <PriorityHigh sx={{ fontSize: 20, color: "error.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Smart Planner
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={1.5}>
          {items.map((item) => (
            <Grid key={item.label} size={{ xs: 6 }}>
              <Box
                sx={{
                  borderLeft: 4,
                  borderColor: item.color,
                  bgcolor: "grey.50",
                  borderRadius: 2.5,
                  p: 1.5,
                  transition: "background 0.15s ease",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Typography sx={{ fontSize: "1.2rem", mb: 0.5 }}>
                  {item.icon}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: item.color, lineHeight: 1.2 }}>
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

      </CardContent>
    </Card>
  );
}
