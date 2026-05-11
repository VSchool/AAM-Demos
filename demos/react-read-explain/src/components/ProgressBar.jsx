function ProgressBar({ percentage }) {
  return (
    <div className="progress-section">
      <div className="progress-label">
        <span>Today's progress</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
