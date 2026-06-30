export default function StatCard({
  title,
  value,
  icon,
  color = "#2E7D32",
  children,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",

        /* IMPORTANT */
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",

        padding: 22,
        minHeight: 130,

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        transition: "all .25s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(15,23,42,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(15,23,42,.08)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#64748B",
              marginBottom: 10,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: 58,
            height: 58,
            minWidth: 58,
            borderRadius: 16,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginLeft: 16,
          }}
        >
          {icon}
        </div>
      </div>

      {children && (
        <div style={{ marginTop: 18 }}>
          {children}
        </div>
      )}
    </div>
  );
}
