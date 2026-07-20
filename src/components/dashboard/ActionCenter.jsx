import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { Bolt } from "@mui/icons-material";

export default function ActionCenter({ actions = [], onViewAll }) {
  const display = actions.slice(0, 3);

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
          <Bolt sx={{ fontSize: 16, color: "warning.main" }} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
            Action Centre
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.65rem" }}>
          Top actions for your attention.
        </Typography>

        <Stack spacing={1.25} sx={{ flex: 1 }}>
          {display.length === 0 ? (
            <Typography variant="caption" color="text.disabled">
              No urgent actions right now.
            </Typography>
          ) : (
            display.map((item, i) => (
              <Stack key={item.id || i} direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 13 }}>{item.icon || "⚡"}</Typography>
                <Typography variant="caption" sx={{ flex: 1, fontSize: "0.7rem" }} noWrap>
                  {item.title}
                </Typography>
                <Chip
                  label="Do now"
                  size="small"
                  color="primary"
                  sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, borderRadius: 1 }}
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
          View all actions
        </Button>

      </CardContent>
    </Card>
  );
}
