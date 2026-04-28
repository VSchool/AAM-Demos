"use client";
// List page — "use client" because it needs useState for filtering
// In Next.js, app/page.js maps to the "/" route automatically (file-based routing)
import { useState } from "react";
import { INITIAL_PROJECTS } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = INITIAL_PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || project.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="page-header">
        <h1>Projects</h1>
        <p className="subtitle">Track and manage your project portfolio</p>
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="project-grid">
        {filtered.length > 0 ? (
          filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="empty-state">No projects match your filters.</p>
        )}
      </div>
    </>
  );
}
