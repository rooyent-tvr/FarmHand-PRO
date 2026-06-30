const variants = {
  success: {
    background: "#DCFCE7",
    color: "#15803D",
  },
  warning: {
    background: "#FEF3C7",
    color: "#B45309",
  },
  danger: {
    background: "#FEE2E2",
    color: "#B91C1C",
  },
  info: {
    background: "#DBEAFE",
    color: "#1D4ED8",
  },
  secondary: {
    background: "#F1F5F9",
    color: "#475569",
  },
};

export default function StatusBadge({
  text,
  variant = "secondary",
}) {
  const style = variants[variant] || variants.secondary;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 12px",
        borderRadius: 999,
        background: style.background,
        color: style.color,
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
