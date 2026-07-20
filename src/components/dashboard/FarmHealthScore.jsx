import {
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { Favorite } from "@mui/icons-material";

const MODULES = [
  { key: "planner", label: "Planner", max: 30 },
  { key: "health", label: "Animal Health", max: 25 },
  { key: "machinery", label: "Machinery", max: 20 },
  { key: "crops", label: "Crops", max: 15 },
  { key: "finance", label: "Finance", max: 10 },
];

function getScoreColor(score) {
  if (score >= 90) return "#2e7d32";
  if (score >= 75) return "#43a047";
  if (score >= 60) return "#f9a825";
  return "#d32f2f";
}

function getBarColor(percentage) {
  if (percentage >= 80) return "#2e7d32";
  if (percentage >= 50) return "#f9a825";
  return "#d32f2f";
}

function getHealthMessage(score) {
  if (score >= 90) {
    return {
      title: "Excellent work!",
      message: "Your farm is operating very efficiently.",
    };
  }
  if (score >= 75) {
    return {
      title: "Good progress.",
      message: "A few improvements could increase your score.",
    };
  }
  if (score >= 60) {
    return {
      title: "Fair condition.",
      message: "Review overdue tasks and machinery maintenance.",
    };
  }
  return {
    title: "Needs attention.",
    message: "Focus on resolving high-priority issues first.",
  };
}

export default function FarmHealthScore({
  score = 100,
  status = "Excellent",
  breakdown = {},
}) {
  const color = getScoreColor(score);
  const healthMessage = getHealthMessage(score);

  return (
    <Card elevation={0} sx={{ borderRadius: 3, height: "100%", border: "1px solid", borderColor: "divider", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: 2 } }}>
      <CardContent sx={{ p: 2 }}>

        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Farm Health Score
          </Typography>
          <Favorite sx={{ fontSize: 20, color }} />
        </Stack>

        {/* Score Circle */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `6px solid ${color}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ color, lineHeight: 1 }}>
              {score}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /100
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color, textAlign: "center", mb: 1.5 }}
        >
          {status}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {/* Module Breakdown */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
          MODULE BREAKDOWN
        </Typography>

        <Stack spacing={1}>
          {MODULES.map(({ key, label, max }) => {
            const value = Number(breakdown[key] || 0);
            const percentage = max > 0 ? (value / max) * 100 : 0;

            return (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Typography
                  variant="caption"
                  sx={{ width: 90, flexShrink: 0, fontWeight: 600 }}
                >
                  {label}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    flex: 1,
                    height: 7,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: getBarColor(percentage),
                    },
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ width: 44, textAlign: "right", flexShrink: 0 }}
                >
                  {value}/{max}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Health Message */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" fontWeight={700}>
            {healthMessage.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {healthMessage.message}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
}
