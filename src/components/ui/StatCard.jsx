export default function StatCard({
  title,
  value,
  icon,
  color = "#2E7D32",
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 22,
        minHeight: 140,
        boxShadow: "0 6px 18px rgba(0,0,0,.08)",
        borderLeft: `6px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all .2s ease",
      }}
    >
      <div
        style={{
          fontSize: 34,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 36,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
