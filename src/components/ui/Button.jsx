export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  style = {},
}) {
  const variants = {
    primary: {
      background: "#2E7D32",
      color: "#fff",
    },
    secondary: {
      background: "#1565C0",
      color: "#fff",
    },
    danger: {
      background: "#D32F2F",
      color: "#fff",
    },
    success: {
      background: "#388E3C",
      color: "#fff",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 26px",
        border: "none",
        borderRadius: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "15px",
        fontWeight: 600,
        transition: "0.2s",
        opacity: disabled ? 0.6 : 1,
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
