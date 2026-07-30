import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { radius } from "../../design/tokens";

export default function PlannerSearch({ value = "", onChange = () => {} }) {
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder="Search tasks by name, animal, module or category..."
      variant="outlined"
      size="small"
      InputProps={{
        sx: { borderRadius: radius.input },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 20, color: "text.disabled" }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <Tooltip title="Clear search">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
