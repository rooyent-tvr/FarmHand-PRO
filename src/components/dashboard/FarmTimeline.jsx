import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";

import {
  Timeline,
  AccessTime,
  History,
} from "@mui/icons-material";

function getDateGroup(timeStr) {
  const eventDate = new Date(timeStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return "TODAY";
  if (eventDate.getTime() === yesterday.getTime()) return "YESTERDAY";
  return "EARLIER";
}

function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function FarmTimeline({
  events = [],
}) {
  // Group events by date
  const groups = {};
  for (const event of events) {
    const group = getDateGroup(event.time);
    if (!groups[group]) groups[group] = [];
    groups[group].push(event);
  }

  const groupOrder = ["TODAY", "YESTERDAY", "EARLIER"];

  return (
    <Card elevation={2} sx={{ borderRadius: 3, minHeight: 220 }}>
      <CardContent sx={{ p: 2.5 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Timeline sx={{ fontSize: 22, color: "#2e7d32" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Farm Activity
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Empty state */}
        {events.length === 0 && (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <History sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No recent farm activity.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              New events will appear here automatically.
            </Typography>
          </Box>
        )}

        {/* Grouped events */}
        {groupOrder.map((groupName) => {
          const groupEvents = groups[groupName];
          if (!groupEvents || groupEvents.length === 0) return null;

          return (
            <Box key={groupName} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                <AccessTime sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {groupName}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                {groupEvents.map((event, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    {/* Timeline dot */}
                    <Box
                      sx={{
                        mt: 0.4,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: event.colour ? `${event.colour}18` : "grey.100",
                        border: `2px solid ${event.colour || "#ccc"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "0.65rem",
                      }}
                    >
                      {event.icon}
                    </Box>

                    {/* Event content */}
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={600}>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                          {formatTime(event.time)}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        {event.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          );
        })}

      </CardContent>
    </Card>
  );
}
