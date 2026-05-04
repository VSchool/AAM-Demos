function ConceptBadges({ concepts }) {
  const classMap = {
    'useState': 'badge--state',
    'controlled input': 'badge--state',
    'props': '',
    'components': '',
    'useEffect([])': 'badge--effect',
    'useEffect([id])': 'badge--effect',
    'useParams': 'badge--router',
    'react-router': 'badge--router',
    'Link': 'badge--router',
    'NavLink': 'badge--router',
    'conditional rendering': 'badge--state',
  }

  return (
    <footer className="site-footer">
      <div className="concept-badges">
        <span className="concept-badges-label">Active concepts</span>
        {concepts.map((concept) => (
          <span
            key={concept}
            className={`badge ${classMap[concept] || ''}`}
          >
            {concept}
          </span>
        ))}
      </div>
    </footer>
  )
}

export default ConceptBadges
