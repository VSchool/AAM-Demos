"use client";
// Add form — "use client" because it needs state for form inputs
// In Next.js, app/new/page.js maps to "/new" automatically (file-based routing)
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = ["Active", "In Progress", "Planning", "Complete"];

export default function NewProject() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    status: "Planning",
    description: "",
    tags: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real app, this would POST to the API route.
    // For this reference app, we just navigate back to demonstrate routing.
    console.log("New project:", {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      created: new Date().toISOString().split("T")[0],
    });

    // useRouter from next/navigation replaces React Router's useNavigate
    router.push("/");
  };

  return (
    <div className="form-page">
      <h1>Add New Project</h1>

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="My Awesome Project"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-input"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="What is this project about?"
            rows={4}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={form.tags}
            onChange={handleChange}
            placeholder="API, Charts, CSS"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
