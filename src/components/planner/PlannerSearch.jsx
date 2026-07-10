import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function PlannerSearch({
  value = "",
  onChange = () => {},
}) {
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Box mb={2}>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          🔍 Search Planner
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Quickly find reminders, animals, breeding records,
          health treatments, crops and finance entries.
        </Typography>
      </Box>

      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder="Search by animal tag, task name, module..."
        variant="outlined"
        InputProps={{
          sx: {
            borderRadius: 3,
            height: 56,
          },

          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="success" />
            </InputAdornment>
          ),

          endAdornment: value ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton
                  onClick={handleClear}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
      />
    </Paper>
  );
}
