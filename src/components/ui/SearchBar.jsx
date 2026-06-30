export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 18,
          color: "#94A3B8",
          pointerEvents: "none",
        }}
      >
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px 12px 42px",
          border: "1px solid #CBD5E1",
          borderRadius: 12,
          background: "#FFFFFF",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color .2s ease, box-shadow .2s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2E7D32";
          e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#CBD5E1";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
