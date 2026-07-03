export default function NotesCard({
  animal,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 8px 20px rgba(15,23,42,.08)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0F172A",
          }}
        >
          📝 Notes & Documents
        </h2>

        <button
          style={{
            background: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ✏ Edit Notes
        </button>
      </div>

      <div
        style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Notes
        </h3>

        <p
          style={{
            color: "#64748B",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {animal?.notes || "No notes have been added for this animal."}
        </p>
      </div>

      <div
        style={{
          background: "#F8FAFC",
          border: "2px dashed #CBD5E1",
          borderRadius: 14,
          padding: 40,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 52 }}>
          📎
        </div>

        <h3>Documents & Photos</h3>

        <p
          style={{
            color: "#64748B",
            marginBottom: 24,
          }}
        >
          Photos, invoices, certificates and other documents
          will be stored here in a future sprint.
        </p>

        <button
          style={{
            background: "#2E7D32",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          📤 Upload File
        </button>
      </div>
    </div>
  );
}
