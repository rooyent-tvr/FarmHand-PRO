import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { TrendingUp, Schedule } from "@mui/icons-material";

function getPriorityChip(priority) {
  switch (priority) {
    case "high":
      return <Chip label="HIGH" size="small" color="error" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    case "medium":
      return <Chip label="MEDIUM" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    default:
      return <Chip label="LOW" size="small" color="success" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
  }
}

export default function PredictiveInsights({ predictions = [] }) {
  return (
    <Card elevation={1} sx={{ borderRadius: 4, transition: "all 0.2s ease", "&:hover": { boxShadow: 3, transform: "translateY(-2px)" } }}>
      <CardContent sx={{ p: 3 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <TrendingUp sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Predictive Insights
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Empty state */}
        {predictions.length === 0 && (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <TrendingUp sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No predictive insights available yet.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Continue recording farm activity to improve forecasting.
            </Typography>
          </Box>
        )}

        {/* Predictions */}
        <Stack spacing={1.5}>
          {predictions.slice(0, 5).map((item, index) => (
            <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Typography sx={{ fontSize: "1.1rem", mt: 0.2 }}>
                    {item.icon}
                  </Typography>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      {getPriorityChip(item.priority)}
                      <Typography variant="body2" fontWeight={700}>
                        {item.title}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                      {item.prediction}
                    </Typography>

                    {/* Confidence bar */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ width: 75, flexShrink: 0 }}>
                        Confidence
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.confidence || 0}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            bgcolor: (item.confidence || 0) >= 80 ? "#2e7d32" : "#f9a825",
                          },
                        }}
                      />
                      <Typography variant="caption" fontWeight={600} sx={{ width: 32, textAlign: "right" }}>
                        {item.confidence || 0}%
                      </Typography>
                    </Stack>

                    {/* Days remaining */}
                    {item.daysUntil !== undefined && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Schedule sx={{ fontSize: 13, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.disabled">
                          {item.daysUntil === 0
                            ? "Today"
                            : `${item.daysUntil} day${item.daysUntil === 1 ? "" : "s"} remaining`}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
}
