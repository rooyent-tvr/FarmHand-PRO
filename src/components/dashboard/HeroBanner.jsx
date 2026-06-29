export default function HeroBanner() {
  const now = new Date();

  const hour = now.getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#fff",
        padding: "28px",
        borderRadius: "16px",
        marginBottom: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,.12)",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          opacity: .9,
        }}
      >
        {greeting} 👋
      </div>

      <h1
        style={{
          margin: "10px 0",
          fontSize: "34px",
          fontWeight: 700,
        }}
      >
        🚜 FarmHand PRO
      </h1>

      <p
        style={{
          margin: 0,
          fontSize: "16px",
          opacity: .9,
        }}
      >
        Manage your entire farm from one dashboard.
      </p>

      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          opacity: .85,
        }}
      >
        {now.toLocaleDateString("en-ZA", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
