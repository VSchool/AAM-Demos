import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavContext } from "../context/NavigationContext";

export default function Contact() {
  const navigate = useNavigate();
  const { recordNavigation } = useNavContext();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    recordNavigation(undefined, "/contact");
  }, [recordNavigation]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleGoHome = () => {
    recordNavigation('useNavigate("/")', "/");
    navigate("/");
  };

  if (submitted) {
    return (
      <div className="page page-contact">
        <div className="success-card">
          <span className="success-icon" aria-hidden="true">&#10003;</span>
          <h2>Message Sent</h2>
          <p>
            Thanks, <strong>{form.name}</strong>! This is a demo, so nothing
            was actually sent. But this shows how forms and routing work together.
          </p>
          <button className="btn btn-primary" onClick={handleGoHome}>
            Go to Home
          </button>
          <div className="route-hint" style={{ marginTop: "1.5rem" }}>
            <p>
              <strong>What's happening:</strong> The "Go to Home" button uses{" "}
              <code>useNavigate("/")</code> for programmatic navigation to a
              specific route. Check the Route Inspector after clicking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-contact">
      <div className="page-header">
        <h1>Contact</h1>
        <p>
          A demo form that shows how forms and routing coexist. Submit it to see
          programmatic navigation with <code>useNavigate()</code>.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="What's on your mind?"
            rows={5}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>

      <div className="route-hint">
        <p>
          <strong>Route pattern:</strong> <code>/contact</code> is a static
          route. After submission, the "Go to Home" button uses{" "}
          <code>useNavigate("/")</code> to navigate programmatically.
        </p>
      </div>
    </div>
  );
}
