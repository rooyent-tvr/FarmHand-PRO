export default function RecentCrops({ crops = [] }) {
  const recent = [...crops]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    )
    .slice(0, 5);

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        marginTop: 20,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 15,
        }}
      >
        🌾 Recent Crops
      </h3>

      {recent.length === 0 ? (
        <p>No crops recorded.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Crop</th>
              <th align="left">Field</th>
              <th align="left">Status</th>
              <th align="right">Area</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((crop) => (
              <tr key={crop.id}>
                <td style={{ padding: "10px 0" }}>
                  🌾 {crop.crop_name}
                </td>

                <td>{crop.field_name}</td>

                <td>{crop.status}</td>

                <td align="right">
                  {crop.area} {crop.area_unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
