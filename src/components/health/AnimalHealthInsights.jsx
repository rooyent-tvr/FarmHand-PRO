import {
  alpha,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import HealingIcon from "@mui/icons-material/Healing";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

function getSeverityColor(severity) {
  switch (severity) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
}

function getSeverityLabel(severity) {
  switch (severity) {
    case "high": return "Critical";
    case "medium": return "Attention";
    case "low": return "Info";
    default: return "Info";
  }
}

function getBadgeLabel(insights) {
  if (!insights || insights.length === 0) return "No Issues";
  const highCount = insights.filter((i) => i.severity === "high").length;
  if (highCount > 0) return `${highCount} Alert${highCount > 1 ? "s" : ""}`;
  return `${insights.length} Insight${insights.length > 1 ? "s" : ""}`;
}

function getBadgeColor(insights) {
  if (!insights || insights.length === 0) return "success";
  if (insights.some((i) => i.severity === "high")) return "error";
  if (insights.some((i) => i.severity === "medium")) return "warning";
  return "success";
}

export default function AnimalHealthInsights({ analytics }) {
  const theme = useTheme();
  const { palette } = theme;

  if (!analytics || !analytics.available) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3, minHeight: 360, bgcolor: "background.paper" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <TipsAndUpdatesIcon sx={{ fontSize: 22, color: "warning.main" }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Health AI Insights
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2.5 }} />
          <Typography color="text.secondary" variant="body2">
            Add health records to receive intelligent recommendations.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { insights = [] } = analytics;
  const allClear = insights.length === 0 || (insights.length === 1 && insights[0].type === "all_good");
  const actionableInsights = insights.filter((i) => i.type !== "all_good");

  return (
    <Card elevation={2} sx={{ borderRadius: 3, minHeight: 360, display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
      <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <TipsAndUpdatesIcon sx={{ fontSize: 22, color: "warning.main" }} />
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Health AI Insights
          </Typography>
          <Chip
            label={getBadgeLabel(allClear ? [] : actionableInsights)}
            size="small"
            color={getBadgeColor(allClear ? [] : actionableInsights)}
            sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22, ml: "auto" }}
          />
        </Stack>

        <Divider sx={{ mb: 2.5 }} />

        {allClear ? (
          <Stack spacing={0} sx={{ flex: 1, justifyContent: "center" }}>
            <Stack alignItems="center" spacing={1.5} sx={{ pb: 2.5 }}>
              <CheckCircleIcon sx={{ fontSize: 44, color: "success.main" }} />
              <Typography variant="h6" fontWeight={700} color="success.main">
                Excellent!
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ lineHeight: 1.6, maxWidth: 280 }}>
                All animal health records are up to date.
                No immediate health actions are required today.
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <SummarySection analytics={analytics} />
          </Stack>
        ) : (
          <Stack spacing={0} sx={{ flex: 1 }}>
            <Stack spacing={1.5}>
              {actionableInsights.map((insight, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(
                      insight.severity === "high" ? palette.error.main
                        : insight.severity === "medium" ? palette.warning.main
                        : palette.success.main,
                      0.04
                    ),
                    border: "1px solid",
                    borderColor: alpha(
                      insight.severity === "high" ? palette.error.main
                        : insight.severity === "medium" ? palette.warning.main
                        : palette.success.main,
                      0.12
                    ),
                  }}
                >
                  <Chip
                    label={getSeverityLabel(insight.severity)}
                    size="small"
                    color={getSeverityColor(insight.severity)}
                    sx={{ fontWeight: 600, fontSize: "0.65rem", height: 22, flexShrink: 0, mt: 0.1 }}
                  />
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {insight.message}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack spacing={1.5} sx={{ mt: "auto", pt: 2.5 }}>
              <Divider />
              <SummarySection analytics={analytics} />
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function SummarySection({ analytics }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
        Today&apos;s Summary
      </Typography>
      <Stack spacing={1}>
        <SummaryRow icon={<VerifiedIcon sx={{ fontSize: 18, color: "success.main" }} />} label="Animals Up To Date" value={analytics.animalsUpToDate} />
        <SummaryRow icon={<HealingIcon sx={{ fontSize: 18, color: "warning.main" }} />} label="Active Treatments" value={analytics.activeTreatments} />
        <SummaryRow icon={<VaccinesIcon sx={{ fontSize: 18, color: "info.main" }} />} label="Vaccinations Due" value={analytics.vaccinationsDue} />
        <SummaryRow icon={<MedicalServicesIcon sx={{ fontSize: 18, color: "secondary.main" }} />} label="Follow-ups Due" value={analytics.followUpsDue} />
        <SummaryRow icon={<ReportProblemIcon sx={{ fontSize: 18, color: "error.main" }} />} label="Disease Cases" value={analytics.diseaseCases} />
      </Stack>
    </Stack>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color="text.primary">
        {value}
      </Typography>
    </Stack>
  );
}
