import ActionButton from "./ActionButton";

export default function EmptyState({
  icon = "📂",
  title = "Nothing here yet",
  description = "Start by creating your first record.",
  buttonText,
  onAction,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "2px dashed #CBD5E1",
        borderRadius: 20,
        padding: 50,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 56,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: 0,
          color: "#0F172A",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          marginTop: 12,
          color: "#64748B",
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {buttonText && (
        <div
          style={{
            marginTop: 30,
          }}
        >
          <ActionButton
            label={buttonText}
            icon="➕"
            onClick={onAction}
          />
        </div>
      )}
    </div>
  );
}
