export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "#2E7D32",
  trend,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        borderLeft: `5px solid ${color}`,
        padding: 22,
        boxShadow: "0 10px 25px rgba(15,23,42,.08)",
        transition: "all .25s ease",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(15,23,42,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(15,23,42,.08)";
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#64748B",
            letterSpacing: ".05em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#0F172A",
            marginTop: 8,
          }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 8,
              color: "#64748B",
              fontSize: 14,
            }}
          >
            {subtitle}
          </div>
        )}

        {trend && (
          <div
            style={{
              marginTop: 10,
              fontWeight: 600,
              color: color,
              fontSize: 13,
            }}
          >
            {trend}
          </div>
        )}
      </div>

      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
