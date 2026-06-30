
import { useState } from "react";
import { deleteBreedingRecord } from "../../services/breedingService";

export default function BreedingTable({
  records = [],
  onEdit,
  refreshRecords,
}) {
  const [search, setSearch] = useState("");

  function getPregnancyProgress(record) {
    if (!record.breeding_date || !record.expected_birth) return 0;
    const start = new Date(record.breeding_date);
    const end = new Date(record.expected_birth);
    const today = new Date();
    const total = Math.max(1, Math.round((end-start)/(1000*60*60*24)));
    const elapsed = Math.round((today-start)/(1000*60*60*24));
    return Math.min(100, Math.max(0, Math.round((elapsed/total)*100)));
  }

  function getDaysRemaining(record) {
    if (!record.expected_birth) return {label:"-",color:"#757575"};
    const today=new Date();
    const due=new Date(record.expected_birth);
    const days=Math.ceil((due-today)/(1000*60*60*24));
    if(days<0) return {label:"🔴 Overdue",color:"#D32F2F"};
    if(days==0) return {label:"🟠 Due Today",color:"#F57C00"};
    if(days<=30) return {label:`🟡 ${days} days`,color:"#F9A825"};
    return {label:`🟢 ${days} days`,color:"#2E7D32"};
  }

  const filtered = records.filter((record)=>{
    const term=search.toLowerCase();
    return (
      (record.female?.tag||"").toLowerCase().includes(term) ||
      (record.male?.tag||"").toLowerCase().includes(term) ||
      (record.status||"").toLowerCase().includes(term) ||
      (record.breeding_method||"").toLowerCase().includes(term)
    );
  });

  async function handleDelete(id){
    if(!window.confirm("Delete this breeding record?")) return;
    try{
      await deleteBreedingRecord(id);
      await refreshRecords();
    }catch(err){alert(err.message);}
  }

  const badgeColor=(s)=>({Pregnant:"#2E7D32",Bred:"#1976D2",Completed:"#8E24AA",Failed:"#D32F2F"}[s]||"#757575");

  return (
<div style={{background:"#fff",padding:24,borderRadius:14,boxShadow:"0 6px 18px rgba(0,0,0,.08)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
<div><h2>Breeding Records</h2><p>{filtered.length} Records</p></div>
<input placeholder="🔍 Search breeding records..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:12,width:300,border:"1px solid #D0D7DE",borderRadius:8}}/>
</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse"}}>
<thead><tr style={{background:"#2E7D32",color:"#fff"}}>
<th style={header}>Female</th><th style={header}>Male</th><th style={header}>Breeding Date</th><th style={header}>Method</th><th style={header}>Expected Birth</th><th style={header}>Progress</th><th style={header}>Days Left</th><th style={header}>Status</th><th style={header}>Actions</th>
</tr></thead>
<tbody>
{filtered.length===0?<tr><td colSpan="9" style={{padding:25,textAlign:"center"}}>No breeding records found.</td></tr>:
filtered.map((record,i)=>{
const progress=getPregnancyProgress(record);
const days=getDaysRemaining(record);
return <tr key={record.id} style={{background:i%2?"#FCFCFC":"#FFF",borderBottom:"1px solid #EEE"}}>
<td style={cell}>🐄 {record.female?.tag}</td>
<td style={cell}>🐂 {record.male?.tag}</td>
<td style={cell}>{record.breeding_date}</td>
<td style={cell}>{record.breeding_method}</td>
<td style={cell}>{record.expected_birth}</td>
<td style={cell}><div style={{width:120,background:"#EEE",borderRadius:8}}><div style={{width:`${progress}%`,background:"#2E7D32",height:10,borderRadius:8}}/></div><small>{progress}%</small></td>
<td style={{...cell,color:days.color,fontWeight:600}}>{days.label}</td>
<td style={cell}><span style={{background:badgeColor(record.status),color:"#fff",padding:"6px 12px",borderRadius:20,fontWeight:600,fontSize:13}}>{record.status}</span></td>
<td style={cell}><button onClick={()=>onEdit(record)} style={editButton}>✏️ Edit</button><button onClick={()=>handleDelete(record.id)} style={deleteButton}>🗑 Delete</button></td>
</tr>})}
</tbody></table></div></div>);
}
const header={padding:14,textAlign:"left"};
const cell={padding:14};
const editButton={background:"#1976D2",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",marginRight:8,fontWeight:600};
const deleteButton={background:"#D32F2F",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:600};
