import { deleteHealthRecord } from "../../services/healthService";

export default function HealthTable({
  records = [],
  onEdit,
  refreshRecords,
}) {
  async function handleDelete(id) {
    if (!confirm("Delete this health record?")) return;

    try {
      await deleteHealthRecord(id);
      if (refreshRecords) await refreshRecords();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        marginTop: 20,
        overflowX: "auto",
      }}
    >
      <h2>Animal Health Records</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Animal</th>
            <th align="left">Treatment</th>
            <th align="left">Medication</th>
            <th align="left">Date</th>
            <th align="left">Next Due</th>
            <th align="right">Cost</th>
            <th align="center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: 20 }}>
                No health records found.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td style={{ padding: "10px 0" }}>
                  {record.livestock?.tag} - {record.livestock?.breed}
                </td>
                <td>{record.treatment_type}</td>
                <td>{record.medication}</td>
                <td>{record.treatment_date}</td>
                <td>{record.next_due || "-"}</td>
                <td align="right">
                  R {Number(record.cost || 0).toFixed(2)}
                </td>
                <td align="center">
                  <button
                    onClick={() => onEdit(record)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
