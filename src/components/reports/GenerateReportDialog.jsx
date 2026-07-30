import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-3-months", label: "Last 3 Months" },
  { value: "custom", label: "Custom Range" },
];

const FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "both", label: "PDF + Excel" },
];

export default function GenerateReportDialog({ open, report, onClose, onGenerate, generating }) {
  const [dateRange, setDateRange] = useState("this-month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(false);

  function handleGenerate() {
    onGenerate({
      reportId: report?.id,
      dateRange,
      startDate,
      endDate,
      format,
      includeCharts,
      includeAiSummary,
      includeBranding,
      includeExecutiveSummary,
    });
  }

  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ pt: 4, px: 4, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AssessmentIcon sx={{ color: "success.main", fontSize: 28 }} />
          <Stack spacing={0}>
            <Typography variant="h6" fontWeight={700}>Generate Report</Typography>
            <Typography variant="body2" color="text.secondary">{report.title}</Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
        <Stack spacing={3}>
          <TextField
            select
            fullWidth
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
          >
            {DATE_RANGES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </TextField>

          {dateRange === "custom" && (
            <Stack direction="row" spacing={2}>
              <TextField fullWidth type="date" label="From" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
              <TextField fullWidth type="date" label="To" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            </Stack>
          )}

          <TextField
            select
            fullWidth
            label="Export Format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            size="small"
          >
            {FORMATS.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
          </TextField>

          <Divider />

          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Options
            </Typography>
            <FormControlLabel control={<Checkbox checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} size="small" />} label="Include Charts" />
            <FormControlLabel control={<Checkbox checked={includeAiSummary} onChange={(e) => setIncludeAiSummary(e.target.checked)} size="small" />} label="Include AI Summary" />
            <FormControlLabel control={<Checkbox checked={includeBranding} onChange={(e) => setIncludeBranding(e.target.checked)} size="small" />} label="Include Farm Branding" />
            <FormControlLabel control={<Checkbox checked={includeExecutiveSummary} onChange={(e) => setIncludeExecutiveSummary(e.target.checked)} size="small" />} label="Include Executive Summary" />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2.5, px: 3 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleGenerate}
          disabled={generating}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5, px: 3 }}
        >
          {generating ? "Generating..." : "Generate Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
