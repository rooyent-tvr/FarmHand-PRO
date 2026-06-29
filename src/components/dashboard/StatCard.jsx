export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            color: "#666",
            fontSize: 14,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 10,
          }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 8,
              color: "#777",
              fontSize: 14,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontSize: 30,
          marginTop: 10,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
