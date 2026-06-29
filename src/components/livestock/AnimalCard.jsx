export default function AnimalCard({ animal }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <h3>{animal.tag}</h3>

      <p>
        <strong>Breed:</strong> {animal.breed}
      </p>

      <p>
        <strong>Gender:</strong> {animal.gender}
      </p>

      <p>
        <strong>Weight:</strong> {animal.weight} kg
      </p>

      <p>
        <strong>Status:</strong> {animal.status}
      </p>
    </div>
  );
}
