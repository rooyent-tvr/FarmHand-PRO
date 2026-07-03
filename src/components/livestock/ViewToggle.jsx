export default function ViewToggle({
  view,
  setView,
}) {
  const active = {
    background: "#2E7D32",
    color: "#FFFFFF",
  };

  const inactive = {
    background: "#E2E8F0",
    color: "#334155",
  };

  const buttonStyle = (selected) => ({
    padding: "10px 18px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    transition: ".25s",
    ...(selected ? active : inactive),
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
      }}
    >
      <button
        style={buttonStyle(view === "table")}
        onClick={() => setView("table")}
      >
        📋 Table
      </button>

      <button
        style={buttonStyle(view === "cards")}
        onClick={() => setView("cards")}
      >
        🗂 Cards
      </button>
    </div>
  );
}
