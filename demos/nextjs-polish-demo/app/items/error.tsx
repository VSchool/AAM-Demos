"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ItemsError({ error, reset }: Props) {
  return (
    <div className="error-container">
      <div className="error-icon" aria-hidden="true">
        &#9888;
      </div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{error.message}</p>
      <button className="btn btn-error" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
