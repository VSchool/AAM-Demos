import Link from "next/link";

export default function ItemNotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Item not found</h1>
      <p className="not-found-message">
        The item you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/items" className="btn btn-accent">
        Back to items
      </Link>
    </div>
  );
}
