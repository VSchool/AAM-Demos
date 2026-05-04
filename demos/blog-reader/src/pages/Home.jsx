import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import ConceptBadges from '../components/ConceptBadges'

function Home() {
  // ---- State: posts data, loading flag, error, search term ----
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // ---- useEffect Pattern 1: fetch on mount (empty dependency array) ----
  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch posts and users in parallel
        const [postsRes, usersRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users'),
        ])

        if (!postsRes.ok || !usersRes.ok) {
          throw new Error('API returned an error')
        }

        const postsData = await postsRes.json()
        const usersData = await usersRes.json()

        if (!cancelled) {
          // Only keep the first 20 posts
          setPosts(postsData.slice(0, 20))
          // Build a lookup map: userId -> user name
          const userMap = {}
          usersData.forEach((u) => {
            userMap[u.id] = u.name
          })
          setUsers(userMap)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup: prevent state updates if component unmounts before fetch completes
    return () => {
      cancelled = true
    }
  }, [])

  // ---- Derived state: filter posts by search term ----
  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  // ---- Retry handler ----
  function handleRetry() {
    setError(null)
    setLoading(true)
    // Re-trigger the effect by forcing a remount — simplest approach
    setPosts([])
    setUsers({})
    // The effect won't re-run on its own (empty deps), so we fetch inline
    fetchRetry()
  }

  async function fetchRetry() {
    try {
      const [postsRes, usersRes] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users'),
      ])
      if (!postsRes.ok || !usersRes.ok) throw new Error('API returned an error')
      const postsData = await postsRes.json()
      const usersData = await usersRes.json()
      setPosts(postsData.slice(0, 20))
      const userMap = {}
      usersData.forEach((u) => { userMap[u.id] = u.name })
      setUsers(userMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="page">
        <div className="page-header">
          <h1>Blog Posts</h1>
          <p>Browse 20 posts from JSONPlaceholder — search, click, explore.</p>
        </div>

        {/* Controlled input: value bound to state, onChange updates state */}
        <div className="search-bar">
          <span className="search-icon" aria-hidden="true">&#8981;</span>
          <input
            type="text"
            placeholder="Search posts by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search posts by title"
          />
        </div>

        {/* Conditional rendering: show different UI based on state */}
        {loading && <LoadingSkeleton count={6} />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && (
          <>
            <p className="post-count">
              Showing <strong>{filtered.length}</strong> of{' '}
              <strong>{posts.length}</strong> posts
            </p>

            {filtered.length === 0 ? (
              <div className="no-results">
                <p>No posts match your search</p>
                <span>Try a different keyword</span>
              </div>
            ) : (
              <div className="post-grid">
                {filtered.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    authorName={users[post.userId] || 'Unknown'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ConceptBadges
        concepts={[
          'components',
          'props',
          'useState',
          'useEffect([])',
          'controlled input',
          'conditional rendering',
          'Link',
        ]}
      />
    </>
  )
}

export default Home
