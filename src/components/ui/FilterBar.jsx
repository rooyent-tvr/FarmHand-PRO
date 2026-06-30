export default function FilterBar({
  filters = [],
  selected,
  onChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      {filters.map((filter) => {
        const active = selected === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: active
                ? "1px solid #2E7D32"
                : "1px solid #CBD5E1",
              background: active
                ? "#2E7D32"
                : "#FFFFFF",
              color: active
                ? "#FFFFFF"
                : "#334155",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .2s ease",
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
