function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon" aria-hidden="true">!</div>
      <h2>Something went wrong</h2>
      <p>{message || 'Failed to load data. Please try again.'}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
