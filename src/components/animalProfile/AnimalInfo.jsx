export default function AnimalInfo({ animal }) {
  if (!animal) return null;

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
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#0F172A",
        }}
      >
        📋 Animal Information
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <InfoCard
          title="Tag"
          value={animal.tag}
        />

        <InfoCard
          title="Species"
          value={animal.animal_type}
        />

        <InfoCard
          title="Breed"
          value={animal.breed}
        />

        <InfoCard
          title="Gender"
          value={animal.gender}
        />

        <InfoCard
          title="Weight"
          value={
            animal.weight
              ? `${animal.weight} kg`
              : "-"
          }
        />

        <InfoCard
          title="Status"
          value={animal.status}
        />

        <InfoCard
          title="Purchase Price"
          value={
            animal.purchase_price
              ? `R ${Number(
                  animal.purchase_price
                ).toLocaleString()}`
              : "-"
          }
        />

        <InfoCard
          title="Purchase Date"
          value={animal.purchase_date || "-"}
        />
      </div>

      <div
        style={{
          marginTop: 28,
          padding: 20,
          borderRadius: 14,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#334155",
          }}
        >
          📝 Notes
        </h3>

        <p
          style={{
            marginBottom: 0,
            color: "#64748B",
            lineHeight: 1.6,
          }}
        >
          {animal.notes || "No notes available."}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#64748B",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}
