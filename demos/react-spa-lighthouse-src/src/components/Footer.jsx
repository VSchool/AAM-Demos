import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">Quick Bites</p>
        <p className="footer-meta">
          React SPA Demo &mdash; Applied AI Mastery Curriculum
        </p>
        <p className="footer-tech">
          Built with React {/* React version ships in the bundle */} + Vite + React Router
        </p>
      </div>
    </footer>
  )
}

export default Footer
