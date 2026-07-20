import {
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { AccountBalance } from "@mui/icons-material";

function getScoreColor(score) {
  if (score >= 80) return "success.dark";
  if (score >= 60) return "success.main";
  if (score >= 40) return "warning.main";
  return "error.main";
}

function getStatus(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Attention";
}

function calculateFinancialScore(analytics) {
  if (!analytics || !analytics.available) return 0;

  let score = 50;

  // Profit margin contribution (up to 30 points)
  const margin = analytics.profitMargin || 0;
  if (margin >= 30) score += 30;
  else if (margin >= 20) score += 25;
  else if (margin >= 10) score += 15;
  else if (margin >= 0) score += 5;
  else score -= 10;

  // Trend contribution (up to 10 points)
  if (analytics.monthlyTrend === "up") score += 10;
  else if (analytics.monthlyTrend === "down") score -= 5;

  // Income diversity (up to 10 points)
  if (analytics.totalIncome > 0) score += 10;

  return Math.max(0, Math.min(100, score));
}

export default function FinancialHealthScore({ analytics }) {
  if (!analytics || !analytics.available) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AccountBalance sx={{ fontSize: 22, color: "secondary.main" }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Financial Health Score
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ py: 3, textAlign: "center" }}>
            <AccountBalance sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Not enough data yet.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Record income and expenses to generate your financial health score.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const score = calculateFinancialScore(analytics);
  const color = getScoreColor(score);
  const status = getStatus(score);

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <AccountBalance sx={{ fontSize: 22, color: "secondary.main" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Financial Health Score
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "center", md: "center" }}
        >
          {/* Score Circle */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: 5,
              borderColor: color,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ color, lineHeight: 1 }}>
              {score}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /100
            </Typography>
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color, mb: 1 }}>
              {status}
            </Typography>

            <Stack spacing={1}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>Profitability</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(analytics.profitMargin || 0).toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, analytics.profitMargin || 0))}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: (analytics.profitMargin || 0) >= 20 ? "success.dark" : "warning.main",
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>Income vs Expenses</Typography>
                  <Typography variant="caption" color="text.secondary">
                    R{Number(analytics.netProfit || 0).toLocaleString()}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.totalIncome > 0
                      ? Math.min(100, (analytics.totalIncome / (analytics.totalIncome + analytics.totalExpenses)) * 100)
                      : 0
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: (analytics.netProfit || 0) >= 0 ? "success.dark" : "error.main",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>

      </CardContent>
    </Card>
  );
}
