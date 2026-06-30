export default function ActionButton({
  label,
  icon,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  const colors = {
    primary: {
      background: "#2E7D32",
      color: "#FFFFFF",
    },
    success: {
      background: "#16A34A",
      color: "#FFFFFF",
    },
    danger: {
      background: "#DC2626",
      color: "#FFFFFF",
    },
    warning: {
      background: "#F59E0B",
      color: "#FFFFFF",
    },
    secondary: {
      background: "#F1F5F9",
      color: "#0F172A",
    },
  };

  const theme = colors[variant] || colors.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "12px 20px",
        border: "none",
        borderRadius: 12,
        background: theme.background,
        color: theme.color,
        fontWeight: 700,
        fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 10px 20px rgba(0,0,0,.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
