import { useMemo, useState } from "react";
import { deleteHealthRecord } from "../../services/healthService";

export default function HealthTable({
  records = [],
  onEdit,
  refreshRecords,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const text = `${r.livestock?.tag ?? ""} ${r.livestock?.breed ?? ""} ${r.treatment_type ?? ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [records, search]);

  function getStatus(nextDue) {
    if (!nextDue) return { label: "No Due Date", color: "#757575" };
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(nextDue); due.setHours(0,0,0,0);
    const diff = Math.round((due - today)/86400000);
    if (diff < 0) return { label:"Overdue", color:"#D32F2F" };
    if (diff <= 7) return { label:"Due Soon", color:"#F57C00" };
    return { label:"Current", color:"#2E7D32" };
  }

  async function handleDelete(id){
    if(!confirm("Delete this health record?")) return;
    await deleteHealthRecord(id);
    await refreshRecords?.();
  }

  return (
    <div style={{background:"#fff",padding:20,borderRadius:12,boxShadow:"0 6px 18px rgba(0,0,0,.08)",marginTop:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
        <h2 style={{margin:0}}>Health Records</h2>
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="🔍 Search animal or treatment..."
          style={{padding:"10px 14px",border:"1px solid #D0D7DE",borderRadius:8,minWidth:260}}
        />
      </div>

      <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:"#F6F8FA"}}>
          <tr>
            <th align="left">Animal</th>
            <th align="left">Treatment</th>
            <th align="left">Status</th>
            <th align="left">Next Due</th>
            <th align="right">Cost</th>
            <th align="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length===0 ? (
            <tr><td colSpan="6" style={{padding:20}}>No records found.</td></tr>
          ) : filtered.map((r,i)=>{
            const s=getStatus(r.next_due);
            return (
              <tr key={r.id} style={{background:i%2?"#FCFCFC":"#FFF",borderBottom:"1px solid #EEE"}}>
                <td style={{padding:"12px 0"}}>🐄 {r.livestock?.tag}<br/><small>{r.livestock?.breed}</small></td>
                <td>{r.treatment_type}</td>
                <td><span style={{background:s.color,color:"#fff",padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{s.label}</span></td>
                <td>{r.next_due || "-"}</td>
                <td align="right">R {Number(r.cost||0).toFixed(2)}</td>
                <td align="center">
                  <button
                    onClick={()=>onEdit?.(r)}
                    style={{
                      background:"#1976D2",
                      color:"#fff",
                      border:"none",
                      borderRadius:6,
                      padding:"7px 12px",
                      cursor:"pointer",
                      marginRight:8,
                      fontWeight:600
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={()=>handleDelete(r.id)}
                    style={{
                      background:"#D32F2F",
                      color:"#fff",
                      border:"none",
                      borderRadius:6,
                      padding:"7px 12px",
                      cursor:"pointer",
                      fontWeight:600
                    }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
