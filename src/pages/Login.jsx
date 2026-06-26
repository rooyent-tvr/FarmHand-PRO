export default function Login() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1b5e20",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 20,
          width: 380,
        }}
      >
        <h1>🌾 FarmHand PRO</h1>

        <p>Professional Farm Management</p>

        <input
          placeholder="Email"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 15,
          }}
        />

        <button
          style={{
            width: "100%",
            marginTop: 20,
            padding: 14,
            background: "#2e7d32",
            color: "white",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
