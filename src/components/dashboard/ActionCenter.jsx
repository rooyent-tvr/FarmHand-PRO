import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Bolt,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";

function getPriorityChip(priority) {
  switch (priority) {
    case "high":
      return <Chip label="HIGH" size="small" color="error" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    case "medium":
      return <Chip label="MEDIUM" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    case "low":
      return <Chip label="LOW" size="small" color="info" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
    default:
      return <Chip label="INFO" size="small" color="success" sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }} />;
  }
}

function getSourceColor(source) {
  switch (source?.toLowerCase()) {
    case "planner":
      return "#ed6c02";
    case "health":
      return "#d32f2f";
    case "machinery":
      return "#1976d2";
    case "crops":
      return "#2e7d32";
    case "finance":
      return "#7b1fa2";
    case "breeding":
      return "#e91e63";
    case "weather":
      return "#0288d1";
    default:
      return "#757575";
  }
}

export default function ActionCenter({
  actions = [],
  tasks = [],
  onComplete,
}) {
  // Support both new `actions` prop and legacy `tasks` prop
  const items = actions.length > 0 ? actions : tasks.map((t) => ({
    priority: "medium",
    icon: "📋",
    title: t.title,
    description: t.module || "General",
    source: t.module || "Planner",
    id: t.id,
    _task: t,
  }));

  const displayItems = items.slice(0, 5);

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Bolt sx={{ fontSize: 22, color: "#ed6c02" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Action Centre
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Empty state */}
        {displayItems.length === 0 && (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <CheckCircle sx={{ fontSize: 36, color: "#2e7d32", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Everything looks good.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              No urgent farm actions at the moment.
            </Typography>
          </Box>
        )}

        {/* Action items */}
        <Stack spacing={1.5}>
          {displayItems.map((item, index) => (
            <Card key={item.id || index} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Typography sx={{ fontSize: "1.1rem", mt: 0.2 }}>
                    {item.icon || "⚡"}
                  </Typography>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      {getPriorityChip(item.priority)}
                      <Typography variant="body2" fontWeight={700}>
                        {item.title}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                      {item.description}
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {item.source && (
                        <Chip
                          label={item.source}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                            bgcolor: `${getSourceColor(item.source)}14`,
                            color: getSourceColor(item.source),
                            border: `1px solid ${getSourceColor(item.source)}40`,
                          }}
                        />
                      )}

                      {item.daysRemaining !== undefined && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Schedule sx={{ fontSize: 13, color: "text.disabled" }} />
                          <Typography variant="caption" color="text.disabled">
                            {item.daysRemaining === 0
                              ? "Today"
                              : `${item.daysRemaining} day${item.daysRemaining === 1 ? "" : "s"}`}
                          </Typography>
                        </Stack>
                      )}

                      {item.due_date && !item.daysRemaining && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Schedule sx={{ fontSize: 13, color: "text.disabled" }} />
                          <Typography variant="caption" color="text.disabled">
                            {item.due_date}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
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
