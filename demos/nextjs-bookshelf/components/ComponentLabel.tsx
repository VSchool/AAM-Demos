interface ComponentLabelProps {
  type: "server" | "client";
  description: string;
}

export default function ComponentLabel({ type, description }: ComponentLabelProps) {
  return (
    <div className="component-label">
      <span className={`component-label-dot ${type}`}></span>
      <span>
        <strong>{type === "server" ? "Server Component" : "Client Component"}</strong>
        {" "}&mdash; {description}
      </span>
    </div>
  );
}
