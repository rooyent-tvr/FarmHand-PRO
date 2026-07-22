import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { getDashboardStatistics } from "../../services/statisticsService";

export default function StatisticsCard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    animals: 0,
    crops: 0,
    machinery: 0,
    tasks: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      setLoading(true);

      const data = await getDashboardStatistics();

      setStats(data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Animals",
      value: stats.animals,
      color: "#4CAF50",
      icon: <PetsIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Crops",
      value: stats.crops,
      color: "#2196F3",
      icon: <AgricultureIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Machinery",
      value: stats.machinery,
      color: "#FF9800",
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: "Tasks",
      value: stats.tasks,
      color: "#9C27B0",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 34 }} />,
    },
  ];

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Account Statistics
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          A live overview of your farm modules.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {cards.map((card) => (
              <Grid
                key={card.title}
                size={{ xs: 6 }}
              >
                <Box
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    bgcolor: `${card.color}10`,
                    border: `1px solid ${card.color}30`,
                    textAlign: "center",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Box sx={{ color: card.color }}>
                      {card.icon}
                    </Box>

                    <Typography
                      variant="h3"
                      fontWeight={700}
                    >
                      {card.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
