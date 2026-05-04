import ConceptBadges from '../components/ConceptBadges'

function About() {
  const concepts = [
    {
      name: 'Components + Props',
      description:
        'Every piece of UI is a reusable function. PostCard, Navbar, ConceptBadges — each receives data via props and renders independently.',
    },
    {
      name: 'State (useState)',
      description:
        'The search input on the Home page is driven by state. Typing updates state, state drives what renders — the core React loop.',
    },
    {
      name: 'Side Effects (useEffect)',
      description:
        'Two patterns in action: fetch-on-mount with an empty dependency array (Home), and fetch-when-param-changes with [id] (PostDetail).',
    },
    {
      name: 'Forms (Controlled Inputs)',
      description:
        'The search bar is a controlled input — its value is always in sync with React state. Every keystroke updates state, which filters the post list.',
    },
    {
      name: 'Routing (react-router-dom)',
      description:
        'HashRouter maps URLs to components. useParams pulls the post ID from the URL. NavLink highlights the active route. Link navigates without page reload.',
    },
  ]

  return (
    <>
      <main className="page page-narrow">
        <div className="about-hero">
          <h1>About This App</h1>
          <p>
            A blog reader built with React that demonstrates five core concepts
            working together in a single application.
          </p>
        </div>

        <div className="concept-grid">
          {concepts.map((concept) => (
            <div key={concept.name} className="concept-card">
              <h3>{concept.name}</h3>
              <p>{concept.description}</p>
            </div>
          ))}
        </div>

        <div className="concept-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <h3 style={{ color: 'var(--accent)' }}>Data Source</h3>
          <p>
            All data comes from{' '}
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSONPlaceholder
            </a>
            , a free fake REST API. Posts, users, and comments are fetched live
            on every page load — no mocked data.
          </p>
        </div>
      </main>

      <ConceptBadges
        concepts={['components', 'props', 'react-router', 'NavLink']}
      />
    </>
  )
}

export default About
