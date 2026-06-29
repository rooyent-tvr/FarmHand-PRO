import { useState } from "react";
import { deleteCrop } from "../../services/cropService";

export default function CropTable({
  crops = [],
  onEdit,
  refreshCrops,
}) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm("Delete this crop?")) return;

    setDeletingId(id);

    try {
      await deleteCrop(id);
      if (refreshCrops) await refreshCrops();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setDeletingId(null);
  }

  const filtered = crops.filter((c) =>
    `${c.crop_name} ${c.variety} ${c.field_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function statusColor(status) {
    switch (status) {
      case "Growing":
        return "#2E7D32";
      case "Harvested":
        return "#1565C0";
      case "Planted":
        return "#EF6C00";
      default:
        return "#555";
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>🌾 Crop List</h2>

      <input
        placeholder="Search crops..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table width="100%" cellPadding="10">
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th>Crop</th>
              <th>Variety</th>
              <th>Field</th>
              <th>Status</th>
              <th>Area</th>
              <th>Yield</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((crop) => (
              <tr key={crop.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{crop.crop_name}</td>
                <td>{crop.variety}</td>
                <td>{crop.field_name}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      color: "white",
                      fontSize: 12,
                      background: statusColor(crop.status),
                    }}
                  >
                    {crop.status}
                  </span>
                </td>

                <td>
                  {crop.area} {crop.area_unit}
                </td>

                <td>
                  {crop.expected_yield} {crop.yield_unit}
                </td>

                <td>
                  <button
                    onClick={() => onEdit(crop)}
                    style={{
                      marginRight: 8,
                      padding: "6px 10px",
                      background: "#1976D2",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(crop.id)}
                    disabled={deletingId === crop.id}
                    style={{
                      padding: "6px 10px",
                      background: "#D32F2F",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    {deletingId === crop.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                  No crops found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
