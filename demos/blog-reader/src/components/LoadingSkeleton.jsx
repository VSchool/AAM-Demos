function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
