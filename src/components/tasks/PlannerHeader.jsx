import {
  Box,
  Button,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

export default function PlannerHeader({
  onWorkspace = () => {},
}) {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        useFlexGap
      >
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
        >
          Add Task
        </Button>

        <Button
          variant="outlined"
          startIcon={<CalendarMonthIcon />}
        >
          Calendar
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<DashboardCustomizeIcon />}
          onClick={onWorkspace}
        >
          Open Workspace
        </Button>
      </Stack>
    </Box>
  );
}
