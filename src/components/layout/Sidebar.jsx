import { Link } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Livestock", path: "/livestock" },
  { name: "Crops", path: "/crops" },
  { name: "Tasks", path: "/tasks" },
  { name: "Reports", path: "/reports" },
  { name: "Account", path: "/account" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#1b5e20",
        color: "white",
        padding: 24,
      }}
    >
      <h2 style={{ marginBottom: 40 }}>🌾 FarmHand PRO</h2>

      {menu.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          style={{
            display: "block",
            padding: "12px 0",
            color: "white",
          }}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}
