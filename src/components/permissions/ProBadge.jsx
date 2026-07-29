export default function ProBadge({
  size = "small",
  style = {},
}) {
  const sizes = {
    small: {
      fontSize: 11,
      padding: "3px 8px",
    },
    medium: {
      fontSize: 12,
      padding: "5px 10px",
    },
    large: {
      fontSize: 14,
      padding: "6px 14px",
    },
  };

  const badge = sizes[size] || sizes.small;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background:
          "linear-gradient(135deg,#16a34a,#15803d)",
        color: "#fff",
        borderRadius: 999,
        fontWeight: 700,
        letterSpacing: ".3px",
        whiteSpace: "nowrap",
        ...badge,
        ...style,
      }}
    >
      ⭐ PRO
    </span>
  );
}
