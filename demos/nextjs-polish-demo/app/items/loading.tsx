export default function ItemsLoading() {
  return (
    <>
      <div className="page-header">
        <div
          className="skeleton"
          style={{ height: "1.75rem", width: "6rem", marginBottom: "0.5rem" }}
        />
        <div
          className="skeleton"
          style={{ height: "1rem", width: "10rem" }}
        />
      </div>
      <div className="item-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-image skeleton" />
            <div className="skeleton-card-body">
              <div className="skeleton-line skeleton-line-medium skeleton" />
              <div className="skeleton-badge skeleton" />
              <div className="skeleton-line skeleton-line-full skeleton" />
              <div className="skeleton-line skeleton-line-short skeleton" />
              <div className="skeleton-footer">
                <div className="skeleton-tag skeleton" />
                <div className="skeleton-tag skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
