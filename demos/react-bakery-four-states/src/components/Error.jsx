function Error({ message, onRetry }) {
  return (
    <div className="error-box">
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

export default Error
