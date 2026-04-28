// Shared project data — importable by both server and client components
// This is the single source of truth for seed data across the app

export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Weather Dashboard",
    status: "Active",
    description:
      "Real-time weather app using OpenWeather API with interactive maps and 7-day forecasts.",
    tags: ["API", "Charts", "CSS"],
    created: "2026-04-15",
  },
  {
    id: 2,
    title: "Task Tracker",
    status: "In Progress",
    description:
      "Kanban-style task management with drag-and-drop, categories, and localStorage persistence.",
    tags: ["State", "DnD", "LocalStorage"],
    created: "2026-04-18",
  },
  {
    id: 3,
    title: "Portfolio Site",
    status: "Planning",
    description:
      "Personal portfolio with project showcase, blog section, and contact form.",
    tags: ["Design", "Routing", "Forms"],
    created: "2026-04-20",
  },
  {
    id: 4,
    title: "Recipe Finder",
    status: "Complete",
    description:
      "Search recipes by ingredients using Spoonacular API with save-to-favorites feature.",
    tags: ["API", "Search", "Favorites"],
    created: "2026-04-10",
  },
  {
    id: 5,
    title: "Budget Planner",
    status: "Active",
    description:
      "Monthly budget tracker with expense categories, charts, and CSV export.",
    tags: ["Charts", "Forms", "Export"],
    created: "2026-04-22",
  },
];
