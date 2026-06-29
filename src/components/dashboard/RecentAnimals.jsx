export default function RecentAnimals({ animals }) {
  return (
    <div
      style={{
        background: "#fff",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3>Recent Livestock</h3>

      {animals.slice(0, 5).map((animal) => (
        <div
          key={animal.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom:
              "1px solid #eee",
          }}
        >
          <strong>{animal.tag}</strong>

          <span>{animal.breed}</span>

          <span>{animal.status}</span>
        </div>
      ))}
    </div>
  );
}
