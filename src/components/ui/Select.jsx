export default function Select({
  children,
  style = {},
  ...props
}) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        height: "48px",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #CBD5E1",
        fontSize: "15px",
        background: "#fff",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
