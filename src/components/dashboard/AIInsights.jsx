import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { SmartToy } from "@mui/icons-material";

function getPriorityColor(p) {
  if (p === "high") return "error";
  if (p === "medium") return "warning";
  return "success";
}

function getPriorityLabel(p) {
  if (p === "high") return "High";
  if (p === "medium") return "Medium";
  return "Low";
}

export default function AIInsights({ insights = [], onViewAll }) {
  const display = insights.slice(0, 3);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
          <SmartToy sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
            AI Assistant
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.65rem" }}>
          Here's what's important today.
        </Typography>

        <Stack spacing={1.25} sx={{ flex: 1 }}>
          {display.length === 0 ? (
            <Typography variant="caption" color="text.disabled">
              No recommendations today.
            </Typography>
          ) : (
            display.map((item, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 13 }}>{item.icon}</Typography>
                <Typography variant="caption" sx={{ flex: 1, fontSize: "0.7rem" }} noWrap>
                  {item.title}
                </Typography>
                <Chip
                  label={getPriorityLabel(item.priority)}
                  size="small"
                  color={getPriorityColor(item.priority)}
                  sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700 }}
                />
              </Stack>
            ))
          )}
        </Stack>

        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={onViewAll}
          sx={{ mt: 2, textTransform: "none", fontSize: "0.7rem", fontWeight: 600, borderRadius: 1.5, alignSelf: "flex-start" }}
        >
          View all insights
        </Button>

      </CardContent>
    </Card>
  );
}
