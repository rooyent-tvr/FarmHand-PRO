export default function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        height: "48px",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #CBD5E1",
        fontSize: "15px",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}
