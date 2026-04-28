// Detail page — server component (no "use client" needed)
// In Next.js App Router, [id] in the folder name creates a dynamic route.
// The params are passed as props — no need for useParams from react-router-dom.
// Compare: React Router uses useParams(), Next.js passes params as a prop.
import Link from "next/link";
import { INITIAL_PROJECTS } from "@/lib/data";
import { notFound } from "next/navigation";
import { use } from "react";

// Required for static export — tells Next.js which [id] values to pre-render
export function generateStaticParams() {
  return INITIAL_PROJECTS.map((p) => ({ id: String(p.id) }));
}

export default function ProjectDetail({ params }) {
  // In Next.js 15+, params is a Promise that must be unwrapped with use()
  const { id } = use(params);
  const project = INITIAL_PROJECTS.find((p) => p.id === Number(id));

  if (!project) {
    notFound();
  }

  return (
    <div className="detail-page">
      <Link href="/" className="back-link">
        &larr; Back to Projects
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{project.title}</h1>
          <span
            className={`badge badge-${project.status.toLowerCase().replace(" ", "-")}`}
          >
            {project.status}
          </span>
        </div>

        <p className="detail-description">{project.description}</p>

        <div className="detail-meta">
          <div className="detail-field">
            <span className="detail-label">Created</span>
            <span className="detail-value">{project.created}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Status</span>
            <span className="detail-value">{project.status}</span>
          </div>
        </div>

        <div className="detail-tags">
          <span className="detail-label">Tags</span>
          <div className="card-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
