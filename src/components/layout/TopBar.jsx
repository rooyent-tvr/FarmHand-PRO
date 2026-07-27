import {
  Badge,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useNotificationBadge } from "../../context/NotificationContext";

export default function TopBar({ onNotificationClick }) {
  const { unreadCount } = useNotificationBadge();

  return (
    <header
      style={{
        background: "#ffffff",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 68,
        boxSizing: "border-box",
      }}
    >
      {/* Left Side */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0D2F1F",
            lineHeight: 1,
          }}
        >
          FELDRIX
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          The Smart Farm Operating System
        </Typography>
      </Box>

      {/* Right Side */}
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          size="small"
          onClick={onNotificationClick}
          aria-label="Notifications"
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            invisible={unreadCount === 0}
          >
            <Notifications
              sx={{
                fontSize: 24,
                color: "#455A64",
              }}
            />
          </Badge>
        </IconButton>
      </Stack>
    </header>
  );
}
