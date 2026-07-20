import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2E7D32",
  children,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 5,
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: 2.75,
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all .25s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(15,23,42,.12)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "text.secondary",
              mb: 1.25,
              display: "block",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.1,
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 58,
            height: 58,
            minWidth: 58,
            borderRadius: 4,
            bgcolor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            ml: 2,
          }}
        >
          {icon}
        </Box>
      </Stack>

      {children && (
        <Box sx={{ mt: 2.25 }}>
          {children}
        </Box>
      )}
    </Paper>
  );
}
