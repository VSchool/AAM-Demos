import { Link } from 'react-router-dom'

function PostCard({ post, authorName }) {
  const preview = post.body.length > 100
    ? post.body.slice(0, 100) + '...'
    : post.body

  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-card-preview">{preview}</p>
      <div className="post-card-meta">
        <span className="author-dot" aria-hidden="true" />
        <span>{authorName}</span>
      </div>
    </Link>
  )
}

export default PostCard
