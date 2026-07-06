import { calculateWeightAnalytics } from "../../utils/weightAnalytics";
import { getGrowthInsights } from "../../utils/growthInsights";

export default function GrowthInsights({
  records = [],
}) {
  const analytics = calculateWeightAnalytics(records);

  if (!analytics) return null;

  const insights = getGrowthInsights(analytics);

  if (!insights.length) return null;

  const colors = {
    success: {
      background: "#ECFDF5",
      border: "#16A34A",
      icon: "🟢",
    },
    info: {
      background: "#EFF6FF",
      border: "#2563EB",
      icon: "ℹ️",
    },
    warning: {
      background: "#FFFBEB",
      border: "#F59E0B",
      icon: "⚠️",
    },
    danger: {
      background: "#FEF2F2",
      border: "#DC2626",
      icon: "🔴",
    },
  };

  return (
    <>
      <h3
        style={{
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 700,
          color: "#1E293B",
        }}
      >
        🧠 Growth Insights
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {insights.map((insight, index) => {
          const style = colors[insight.type];

          return (
            <div
              key={index}
              style={{
                background: style.background,
                borderLeft: `6px solid ${style.border}`,
                borderRadius: 12,
                padding: 18,
                boxShadow:
                  "0 6px 16px rgba(15,23,42,.06)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  marginBottom: 6,
                }}
              >
                {style.icon} {insight.title}
              </div>

              <div
                style={{
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                {insight.message}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
