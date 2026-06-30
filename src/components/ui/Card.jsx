export default function Card({
  title,
  subtitle,
  children,
  footer,
  action,
  style = {},
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        transition: "all .25s ease",
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(15,23,42,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(15,23,42,.08)";
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
            gap: 16,
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {title}
              </h3>
            )}

            {subtitle && (
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748B",
                  fontSize: 14,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 20,
            borderTop: "1px solid #E2E8F0",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
