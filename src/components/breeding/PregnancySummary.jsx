import { getLatestPregnancy } from "../../utils/pregnancyAnalytics";
import { getPregnancyInsight } from "../../utils/pregnancyInsights";

export default function PregnancySummary({
  records = [],
}) {
  const pregnancy = getLatestPregnancy(records);

  if (!pregnancy) return null;

  const insight = getPregnancyInsight(pregnancy);

  const card = {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 20px rgba(15,23,42,.08)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const label = {
    fontSize: 12,
    color: "#64748B",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: 0.5,
  };

  const value = {
    fontSize: 28,
    fontWeight: 700,
    color: "#0F172A",
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          marginBottom: 18,
          color: "#0F172A",
        }}
      >
        🐄 Pregnancy Overview
      </h2>

      {/* Status Banner */}

      <div
        style={{
          background: insight.background,
          borderLeft: `6px solid ${insight.color}`,
          borderRadius: 16,
          padding: 18,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: insight.color,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{insight.icon}</span>
          <span>{insight.title}</span>
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 17,
            fontWeight: 600,
            color: "#0F172A",
          }}
        >
          {insight.stage}
        </div>

        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          {insight.advice}
        </p>
      </div>

      {/* Summary Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        <div style={card}>
          <span style={label}>Current Status</span>

          <span
            style={{
              ...value,
              color: insight.color,
            }}
          >
            {pregnancy.status}
          </span>
        </div>

        <div style={card}>
          <span style={label}>Days Pregnant</span>

          <span style={value}>
            {pregnancy.pregnantDays}
          </span>
        </div>

        <div style={card}>
          <span style={label}>Days Remaining</span>

          <span style={value}>
            {pregnancy.daysRemaining}
          </span>
        </div>

        <div style={card}>
          <span style={label}>Expected Birth</span>

          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#2563EB",
            }}
          >
            {pregnancy.expectedBirth || "-"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}

      <div
        style={{
          marginTop: 24,
          background: "#E5E7EB",
          height: 14,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pregnancy.progress}%`,
            height: "100%",
            background: insight.color,
            transition: "width .4s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontSize: 14,
          color: "#64748B",
        }}
      >
        <span>Pregnancy Progress</span>

        <strong>{pregnancy.progress}%</strong>
      </div>
    </div>
  );
}
