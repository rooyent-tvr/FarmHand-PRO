import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PlannerSummary({
  today = 0,
  upcoming = 0,
  overdue = 0,
  completed = 0,
}) {
  const cards = [
    {
      title: "Today's Tasks",
      value: today,
      subtitle: "Tasks scheduled today",
      color: "#2E7D32",
      icon: <TodayIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Upcoming",
      value: upcoming,
      subtitle: "Upcoming reminders",
      color: "#1976D2",
      icon: <EventIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Overdue",
      value: overdue,
      subtitle: "Needs attention",
      color: "#D32F2F",
      icon: <WarningAmberIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Completed",
      value: completed,
      subtitle: "Finished tasks",
      color: "#7B1FA2",
      icon: <CheckCircleIcon sx={{ fontSize: 34 }} />,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          sm={6}
          lg={3}
          key={card.title}
        >
          <Card
            elevation={4}
            sx={{
              height: "100%",
              borderLeft: `6px solid ${card.color}`,
              borderRadius: 3,
              transition: "0.25s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    color: card.color,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {card.icon}

                  <Typography
                    variant="h3"
                    fontWeight={700}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {card.subtitle}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
