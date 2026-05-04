import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import RouteInspector from "./components/RouteInspector";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Breadcrumbs />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
          <Route path="/projects/:id" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </main>
      <RouteInspector />
    </div>
  );
}
