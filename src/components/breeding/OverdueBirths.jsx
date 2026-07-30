import { useNavigate } from "react-router-dom";

import {
  alpha,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function OverdueBirths({ records = [] }) {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = records
    .filter((r) => r.expected_birth && r.status === "Pregnant")
    .map((record) => {
      const expected = new Date(record.expected_birth);
      expected.setHours(0, 0, 0, 0);
      const overdueDays = Math.ceil((today - expected) / (1000 * 60 * 60 * 24));
      return { ...record, overdueDays };
    })
    .filter((r) => r.overdueDays > 0)
    .sort((a, b) => b.overdueDays - a.overdueDays);

  return (
    <Card elevation={2} sx={{ borderRadius: 3, bgcolor: "background.paper" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningAmberIcon sx={{ fontSize: 22, color: "error.main" }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Overdue Births
            </Typography>
            {overdue.length > 0 && (
              <Chip
                label={`${overdue.length} overdue`}
                size="small"
                color="error"
                sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22, ml: "auto" }}
              />
            )}
          </Stack>

          <Divider />

          {overdue.length === 0 ? (
            <Stack alignItems="center" spacing={1.5} sx={{ py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 44, color: "success.main" }} />
              <Typography variant="h6" fontWeight={700} color="success.main">
                No Overdue Births
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ lineHeight: 1.6, maxWidth: 300 }}>
                All pregnancies are progressing within their expected gestation period.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={0} divider={<Divider sx={{ ml: 6.5 }} />}>
              {overdue.map((record) => (
                <ButtonBase
                  key={record.id}
                  onClick={() => navigate(`/animals/${record.female_id || record.id}`, { state: { source: "breeding", section: "breeding" } })}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      boxShadow: `0 2px 8px ${alpha(palette.text.primary, 0.06)}`,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, px: 1.5, width: "100%" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(palette.error.main, 0.1),
                        color: "error.main",
                        flexShrink: 0,
                      }}
                    >
                      <WarningAmberIcon sx={{ fontSize: 22 }} />
                    </Box>

                    <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
                          {record.female?.tag || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {record.female?.breed || ""}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.disabled">
                        Sire: {record.male?.tag || "Unknown"} • Expected: {new Date(record.expected_birth).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                      </Typography>
                    </Stack>

                    <Chip
                      label={`${record.overdueDays}d Overdue`}
                      size="small"
                      color="error"
                      sx={{ fontWeight: 700, fontSize: "0.65rem", height: 24, minWidth: 80, flexShrink: 0 }}
                    />

                    <ChevronRightIcon sx={{ color: "text.disabled", fontSize: 20, flexShrink: 0 }} />
                  </Stack>
                </ButtonBase>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
