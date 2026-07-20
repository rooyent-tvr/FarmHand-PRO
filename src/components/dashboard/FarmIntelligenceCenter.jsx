import { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Psychology,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";

import { getInsightActions } from "../../services/intelligence/actions";

const MAX_INSIGHTS = 5;

const FILTER_OPTIONS = ["All", "Critical", "High", "Medium", "Low"];

function getPriorityColor(priority) {
  switch (priority) {
    case "Critical":
      return "error";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    case "Low":
      return "success";
    default:
      return "default";
  }
}

function getCategoryColor(category) {
  switch (category) {
    case "Planner":
      return "#ed6c02";
    case "Livestock":
      return "#d32f2f";
    case "Crops":
      return "#2e7d32";
    case "Finance":
      return "#7b1fa2";
    case "Machinery":
      return "#1976d2";
    case "Weather":
      return "#0288d1";
    default:
      return "#757575";
  }
}

export default function FarmIntelligenceCenter({
  insights = [],
  onAction,
}) {
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);
  const prevInsightsRef = useRef(insights);

  // Track when insights change to update timestamp
  useEffect(() => {
    if (insights !== prevInsightsRef.current) {
      setLastUpdated(new Date());
      prevInsightsRef.current = insights;
    }
  }, [insights]);

  // Count by priority
  const counts = useMemo(() => ({
    Critical: insights.filter((i) => i.priority === "Critical").length,
    High: insights.filter((i) => i.priority === "High").length,
    Medium: insights.filter((i) => i.priority === "Medium").length,
    Low: insights.filter((i) => i.priority === "Low").length,
  }), [insights]);

  // Filtered insights
  const filteredInsights = useMemo(() => {
    if (filter === "All") return insights.slice(0, MAX_INSIGHTS);
    return insights.filter((i) => i.priority === filter).slice(0, MAX_INSIGHTS);
  }, [insights, filter]);

  return (
    <Card elevation={1} sx={{ borderRadius: 4, transition: "all 0.2s ease", "&:hover": { boxShadow: 3, transform: "translateY(-2px)" } }}>
      <CardContent sx={{ p: 3 }}>

        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Psychology sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Farm Intelligence
          </Typography>
          {lastUpdated && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTime sx={{ fontSize: 13, color: "text.disabled" }} />
              <Typography variant="caption" color="text.disabled">
                {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Summary counts */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
          {counts.Critical > 0 && (
            <Chip label={`${counts.Critical} Critical`} size="small" color="error" sx={{ fontWeight: 600, fontSize: "0.65rem", height: 20 }} />
          )}
          {counts.High > 0 && (
            <Chip label={`${counts.High} High`} size="small" color="warning" sx={{ fontWeight: 600, fontSize: "0.65rem", height: 20 }} />
          )}
          {counts.Medium > 0 && (
            <Chip label={`${counts.Medium} Medium`} size="small" color="info" sx={{ fontWeight: 600, fontSize: "0.65rem", height: 20 }} />
          )}
          {counts.Low > 0 && (
            <Chip label={`${counts.Low} Low`} size="small" color="success" sx={{ fontWeight: 600, fontSize: "0.65rem", height: 20 }} />
          )}
          {insights.length === 0 && (
            <Chip label="No issues" size="small" color="success" sx={{ fontWeight: 600, fontSize: "0.65rem", height: 20 }} />
          )}
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Filter chips */}
        <Stack direction="row" spacing={0.75} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          {FILTER_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              size="small"
              variant={filter === option ? "filled" : "outlined"}
              color={filter === option ? (option === "All" ? "primary" : getPriorityColor(option)) : "default"}
              onClick={() => setFilter(option)}
              sx={{
                fontWeight: 600,
                fontSize: "0.65rem",
                height: 22,
                cursor: "pointer",
              }}
            />
          ))}
        </Stack>

        {/* Empty state */}
        {filteredInsights.length === 0 && (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <CheckCircle sx={{ fontSize: 36, color: "success.main", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Farm Operating Normally
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filter === "All"
                ? "No important recommendations today."
                : `No ${filter.toLowerCase()} priority insights.`}
            </Typography>
          </Box>
        )}

        {/* Insights */}
        <Stack spacing={1.5}>
          {filteredInsights.map((insight, index) => {
            const registryActions = getInsightActions(insight);

            return (
              <Card
                key={insight.id || index}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    {/* Priority dot */}
                    <Box
                      sx={{
                        mt: 0.7,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: `${getPriorityColor(insight.priority)}.main`,
                        flexShrink: 0,
                      }}
                    />

                    <Box sx={{ flex: 1 }}>
                      {/* Priority + Category */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Chip
                          label={insight.priority}
                          size="small"
                          color={getPriorityColor(insight.priority)}
                          sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }}
                        />
                        {insight.category && (
                          <Chip
                            label={insight.category}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.6rem",
                              fontWeight: 600,
                              bgcolor: `${getCategoryColor(insight.category)}14`,
                              color: getCategoryColor(insight.category),
                              border: `1px solid ${getCategoryColor(insight.category)}40`,
                            }}
                          />
                        )}
                      </Stack>

                      {/* Title */}
                      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                        {insight.title}
                      </Typography>

                      {/* Description */}
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                        {insight.description}
                      </Typography>

                      {/* Actions from registry */}
                      {registryActions.length > 0 ? (
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                          {registryActions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant="outlined"
                              size="small"
                              sx={{ textTransform: "none", fontSize: "0.7rem", py: 0.25, px: 1 }}
                              onClick={() => onAction?.(action.route || insight.route, action.payload)}
                            >
                              {action.label || action.action || "View"}
                            </Button>
                          ))}
                        </Stack>
                      ) : (
                        /* Default action button (backward compatible) */
                        insight.action && insight.route && (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: "none", fontSize: "0.7rem", py: 0.25, px: 1 }}
                            onClick={() => onAction?.(insight.route)}
                          >
                            {insight.action}
                          </Button>
                        )
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

      </CardContent>
    </Card>
  );
}
