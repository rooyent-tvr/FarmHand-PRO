import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { History } from "@mui/icons-material";

function buildActivityFeed(animals, crops) {
  const events = [];

  const recentAnimals = [...animals]
    .filter((a) => a.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  for (const animal of recentAnimals) {
    events.push({
      icon: "🐄",
      title: `${animal.tag || animal.name || "Animal"} added`,
      time: animal.created_at,
    });
  }

  const recentCrops = [...crops]
    .filter((c) => c.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  for (const crop of recentCrops) {
    events.push({
      icon: "🌾",
      title: `${crop.name || crop.crop_name || "Crop"} — ${crop.status || "added"}`,
      time: crop.created_at,
    });
  }

  events.sort((a, b) => new Date(b.time) - new Date(a.time));
  return events.slice(0, 6);
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export default function RecentFarmActivity({ animals = [], crops = [] }) {
  const events = buildActivityFeed(animals, crops);

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
          <History sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Recent Farm Activity
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {events.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <History sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              No recent activity recorded yet.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Activity will appear here as you manage your farm.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {events.map((event, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  py: 0.5,
                  px: 1,
                  borderRadius: 2,
                  transition: "background 0.15s ease",
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                <Typography sx={{ fontSize: "1rem" }}>
                  {event.icon}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {event.title}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                  {formatRelativeTime(event.time)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

      </CardContent>
    </Card>
  );
}
