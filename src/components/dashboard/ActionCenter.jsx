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
          <Bolt sx={{ fontSize: 20, color: "warning.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Action Centre
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {displayItems.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <CheckCircle sx={{ fontSize: 32, color: "success.main", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Everything looks good.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              No urgent farm actions at the moment.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {displayItems.map((item, index) => (
              <Card
                key={item.id || index}
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  transition: "box-shadow 0.15s ease",
                  "&:hover": { boxShadow: 1 },
                }}
              >
                <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Typography sx={{ fontSize: "1rem", mt: 0.2 }}>
                      {item.icon || "⚡"}
                    </Typography>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
                        {getPriorityChip(item.priority)}
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {item.title}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                        {item.description}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        {item.source && (
                          <Chip
                            label={item.source}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: "0.55rem",
                              fontWeight: 600,
                              bgcolor: `${getSourceColor(item.source)}14`,
                              color: getSourceColor(item.source),
                              border: `1px solid ${getSourceColor(item.source)}30`,
                            }}
                          />
                        )}
                        {item.daysRemaining !== undefined && (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Schedule sx={{ fontSize: 11, color: "text.disabled" }} />
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
                              {item.daysRemaining === 0 ? "Today" : `${item.daysRemaining}d`}
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
        )}

      </CardContent>
    </Card>
  );
}
