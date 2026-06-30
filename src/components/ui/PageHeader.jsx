export default function PageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 30,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              marginTop: 10,
              color: "#64748B",
              fontSize: 16,
              maxWidth: 700,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
