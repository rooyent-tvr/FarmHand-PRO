import { Link } from "react-router-dom";

const menu = [
  {
    name: "🏠 Dashboard",
    path: "/dashboard",
  },
  {
    name: "🐄 Livestock",
    path: "/livestock",
  },
  {
    name: "❤️ Animal Health",
    path: "/health",
  },
  {
    name: "🐂 Breeding",
    path: "/breeding",
  },
  {
    name: "💰 Finance",
    path: "/finance",
  },
  {
    name: "🌾 Crops",
    path: "/crops",
  },
  {
    name: "📋 Tasks",
    path: "/tasks",
  },
  {
    name: "📊 Reports",
    path: "/reports",
  },
  {
    name: "⚙️ Account",
    path: "/account",
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#1B5E20",
        color: "white",
        padding: 24,
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: 40,
        }}
      >
        🌾 FarmHand PRO
      </h2>

      {menu.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          style={{
            display: "block",
            padding: "14px 0",
            color: "white",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}
