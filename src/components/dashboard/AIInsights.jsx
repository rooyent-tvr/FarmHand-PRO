import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

const EXPLANATIONS = {
  "Outstanding Tasks":
    "Completing these tasks will improve your Farm Health Score.",
  "Health Treatments Due":
    "Treatments completed on time improve herd health.",
  "Machinery Service":
    "Preventive maintenance reduces unexpected downtime.",
  "Harvest Planning":
    "Harvesting at the correct time improves yield quality.",
  "Profit Alert":
    "Monitoring profitability helps maintain cash flow.",
  "Everything Looks Good":
    "Keep monitoring your dashboard to stay ahead.",
};

const ACTION_BUTTONS = {
  "Outstanding Tasks": "Open Planner",
  "Health Treatments Due": "Open Health",
  "Machinery Service": "View Machinery",
  "Harvest Planning": "View Crops",
  "Profit Alert": "Open Finance",
};

function getPriorityIcon(priority) {
  switch (priority) {
    case "high":
      return <ArrowUpward sx={{ color: "#d32f2f", fontSize: 16 }} />;
    case "medium":
      return <ArrowForward sx={{ color: "#f9a825", fontSize: 16 }} />;
    default:
      return <CheckCircle sx={{ color: "#2e7d32", fontSize: 16 }} />;
  }
}

function getPriorityChip(priority) {
  switch (priority) {
    case "high":
      return <Chip label="HIGH" size="small" color="error" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    case "medium":
      return <Chip label="MEDIUM" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    default:
      return <Chip label="INFO" size="small" color="success" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
  }
}

export default function AIInsights({
  insights = [],
}) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <SmartToy sx={{ fontSize: 22, color: "#2e7d32" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Farm AI Assistant
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
          TODAY'S RECOMMENDATIONS
        </Typography>

        <Stack spacing={1.5}>
          {insights.map((item, index) => {
            const explanation = EXPLANATIONS[item.title] || "";
            const actionLabel = ACTION_BUTTONS[item.title];

            return (
              <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ mt: 0.3 }}>
                      {getPriorityIcon(item.priority)}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {getPriorityChip(item.priority)}
                      </Stack>

                      <Typography variant="body2" fontWeight={700} sx={{ mt: 0.75 }}>
                        {item.icon} {item.title}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        {item.message}
                      </Typography>

                      {explanation && (
                        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}>
                          {explanation}
                        </Typography>
                      )}

                      {actionLabel && (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1, textTransform: "none", fontSize: "0.7rem", py: 0.25, px: 1 }}
                        >
                          {actionLabel}
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", textAlign: "center", mt: 1.5 }}
        >
          Recommendations are generated from live farm data and updated automatically.
        </Typography>

      </CardContent>
    </Card>
  );
}
