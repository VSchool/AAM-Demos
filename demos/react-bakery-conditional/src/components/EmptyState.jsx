function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h2 className="empty-title">{title}</h2>
      <p className="empty-message">{message}</p>
      {actionLabel && (
        <button className="empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
