import { Button, Stack } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { radius } from "../../design/tokens";

export default function ViewToggle({ view, setView }) {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant={view === "table" ? "contained" : "outlined"}
        color={view === "table" ? "success" : "inherit"}
        startIcon={<TableChartIcon sx={{ fontSize: 16 }} />}
        onClick={() => setView("table")}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.78rem",
          borderRadius: radius.button,
          px: 2,
          py: 0.75,
        }}
      >
        Table
      </Button>
      <Button
        size="small"
        variant={view === "cards" ? "contained" : "outlined"}
        color={view === "cards" ? "success" : "inherit"}
        startIcon={<ViewModuleIcon sx={{ fontSize: 16 }} />}
        onClick={() => setView("cards")}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.78rem",
          borderRadius: radius.button,
          px: 2,
          py: 0.75,
        }}
      >
        Cards
      </Button>
    </Stack>
  );
}
