import { Badge, IconButton, Stack, Typography } from "@mui/material";
import { Notifications } from "@mui/icons-material";

export default function TopBar({ unreadCount = 0, onNotificationClick }) {
  return (
    <header
      style={{
        background: "white",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
        FarmHand PRO
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          size="small"
          onClick={onNotificationClick}
          aria-label="Notifications"
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <Notifications sx={{ fontSize: 22, color: "text.secondary" }} />
          </Badge>
        </IconButton>
      </Stack>
    </header>
  );
}
