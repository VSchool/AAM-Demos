import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import ConceptBadges from '../components/ConceptBadges'

function PostDetail() {
  // ---- useParams: read the dynamic :id from the URL ----
  const { id } = useParams()

  const [post, setPost] = useState(null)
  const [author, setAuthor] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- useEffect Pattern 2: re-fetch when `id` changes ----
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchPost() {
      try {
        // 1. Fetch the post
        const postRes = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        )
        if (!postRes.ok) throw new Error('Post not found')
        const postData = await postRes.json()

        // 2. Fetch author and comments in parallel
        const [authorRes, commentsRes] = await Promise.all([
          fetch(
            `https://jsonplaceholder.typicode.com/users/${postData.userId}`
          ),
          fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}/comments`
          ),
        ])

        if (!authorRes.ok) throw new Error('Could not load author')
        if (!commentsRes.ok) throw new Error('Could not load comments')

        const authorData = await authorRes.json()
        const commentsData = await commentsRes.json()

        if (!cancelled) {
          setPost(postData)
          setAuthor(authorData)
          setComments(commentsData)
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

    fetchPost()

    return () => {
      cancelled = true
    }
  }, [id])

  // ---- Loading state ----
  if (loading) {
    return (
      <>
        <main className="page page-narrow">
          <div className="loading-container">
            <div className="spinner" aria-label="Loading post" />
            <span className="loading-text">Loading post...</span>
          </div>
        </main>
        <ConceptBadges
          concepts={['useParams', 'useEffect([id])', 'useState']}
        />
      </>
    )
  }

  // ---- Error state ----
  if (error) {
    return (
      <>
        <main className="page page-narrow">
          <Link to="/" className="detail-back">
            &larr; Back to Posts
          </Link>
          <ErrorMessage message={error} />
        </main>
        <ConceptBadges
          concepts={['useParams', 'useEffect([id])', 'conditional rendering']}
        />
      </>
    )
  }

  // ---- Compute author initials for avatar ----
  const initials = author
    ? author.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
    : '?'

  return (
    <>
      <main className="page page-narrow">
        <Link to="/" className="detail-back">
          &larr; Back to Posts
        </Link>

        {/* Post header */}
        <header className="detail-header">
          <h1 className="detail-title">{post.title}</h1>
          {author && (
            <div className="detail-author">
              <div className="detail-author-avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="detail-author-info">
                <strong>{author.name}</strong>
                <span>
                  {author.company?.name} &middot; {author.email}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Post body */}
        <div className="detail-body">{post.body}</div>

        {/* Comments section */}
        <section className="comments-section" aria-label="Comments">
          <h2 className="comments-heading">
            Comments
            <span className="comment-count-badge">{comments.length}</span>
          </h2>
          {comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div className="comment-header">
                <span className="comment-name">{comment.name}</span>
                <span className="comment-email">{comment.email}</span>
              </div>
              <p className="comment-body">{comment.body}</p>
            </article>
          ))}
        </section>
      </main>

      <ConceptBadges
        concepts={[
          'components',
          'props',
          'useState',
          'useEffect([id])',
          'useParams',
          'conditional rendering',
          'Link',
        ]}
      />
    </>
  )
}

export default PostDetail
