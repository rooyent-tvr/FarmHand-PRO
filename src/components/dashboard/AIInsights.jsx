import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  SmartToy,
  ArrowUpward,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";

function getPriorityIcon(priority) {
  switch (priority) {
    case "high":
      return <ArrowUpward sx={{ color: "#d32f2f" }} />;
    case "medium":
      return <ArrowForward sx={{ color: "#f9a825" }} />;
    default:
      return <CheckCircle sx={{ color: "#2e7d32" }} />;
  }
}

export default function AIInsights({
  insights = [],
}) {
  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <SmartToy sx={{ fontSize: 28, color: "#2e7d32" }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Farm AI Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Smart recommendations generated from your farm data
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          {insights.map((item, index) => (
            <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ mt: 0.3 }}>
                    {getPriorityIcon(item.priority)}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {item.icon} {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.message}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
          AI recommendations are generated from live planner, livestock, machinery, crop and finance data.
        </Typography>

      </CardContent>
    </Card>
  );
}
