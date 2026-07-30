import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { getSubscriptionEvents } from "../../services/billingService";
import { getCurrentUser } from "../../services/profileService";

function getEventIcon(type) {
  switch (type) {
    case "payment":
      return <PaymentIcon sx={{ fontSize: 18, color: "#16a34a" }} />;
    case "cancellation_requested":
      return <CancelIcon sx={{ fontSize: 18, color: "#f59e0b" }} />;
    case "subscription_created":
      return <AddCircleIcon sx={{ fontSize: 18, color: "#6366f1" }} />;
    default:
      return <CheckCircleIcon sx={{ fontSize: 18, color: "#6366f1" }} />;
  }
}

function getEventColor(type) {
  switch (type) {
    case "payment":
      return "rgba(34,197,94,0.1)";
    case "cancellation_requested":
      return "rgba(245,158,11,0.1)";
    case "subscription_created":
      return "rgba(99,102,241,0.1)";
    default:
      return "rgba(99,102,241,0.1)";
  }
}

export default function SubscriptionTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }
        const data = await getSubscriptionEvents(user.id);
        setEvents(data);
      } catch (err) {
        console.error("Failed to load subscription events:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(14,165,233,0.1)",
              }}
            >
              <TimelineIcon sx={{ color: "#0ea5e9", fontSize: 22 }} />
            </Box>
            <Stack spacing={0}>
              <Typography variant="h6" fontWeight={700}>
                Subscription Timeline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your subscription lifecycle events
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          {/* Content */}
          {loading ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress size={32} />
            </Stack>
          ) : events.length === 0 ? (
            <Stack alignItems="center" py={4} spacing={1}>
              <TimelineIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography color="text.secondary" fontWeight={500}>
                No billing events yet
              </Typography>
              <Typography variant="body2" color="text.disabled" textAlign="center">
                Subscription events will appear here as your account activity grows.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={0}>
              {events.map((event, index) => (
                <Stack key={event.id} direction="row" spacing={2} sx={{ position: "relative" }}>
                  {/* Vertical connector line */}
                  {index < events.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 17,
                        top: 40,
                        bottom: 0,
                        width: 2,
                        bgcolor: "divider",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: getEventColor(event.type),
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    {getEventIcon(event.type)}
                  </Box>

                  {/* Content */}
                  <Stack spacing={0.25} sx={{ pb: 3, flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "\u2014"}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
