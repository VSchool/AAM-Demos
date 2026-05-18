import { useState, useMemo } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  doors: string;
  venue: string;
  genre: string;
  price: string;
  image: string;
  href: string;
}

interface Props {
  events: Event[];
}

export default function GenreFilter({ events }: Props) {
  const [selected, setSelected] = useState<string>('All');

  const genres = useMemo(() => {
    const set = new Set(events.map((e) => e.genre));
    return ['All', ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    if (selected === 'All') return events;
    return events.filter((e) => e.genre === selected);
  }, [events, selected]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    const day = d.getUTCDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    return { day, month };
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
        role="tablist"
        aria-label="Filter shows by genre"
      >
        {genres.map((g) => {
          const isActive = g === selected;
          return (
            <button
              key={g}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelected(g)}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: '0.8rem',
                letterSpacing: '0.04em',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: isActive ? '#FF5C2E' : 'transparent',
                color: isActive ? '#0E0E12' : '#F5F0E8',
                borderColor: isActive ? '#FF5C2E' : 'rgba(255,255,255,0.16)',
              }}
            >
              {g}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  marginLeft: '0.5rem',
                  opacity: isActive ? 0.7 : 0.5,
                }}
              >
                {g === 'All' ? events.length : events.filter((e) => e.genre === g).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#A8A39A',
          marginBottom: '1.5rem',
        }}
        aria-live="polite"
      >
        Showing {filtered.length} of {events.length}
        {selected !== 'All' && ` · ${selected}`}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '4px',
            color: '#A8A39A',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', textTransform: 'uppercase', color: '#F5F0E8', marginBottom: '0.75rem' }}>
            No shows for that filter
          </div>
          <p>Try another genre, or pick "All" to see everything on the calendar.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filtered.map((event) => {
            const { day, month } = formatDate(event.date);
            return (
              <a
                key={event.id}
                href={event.href}
                style={{
                  background: '#181821',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#FF5C2E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div
                  style={{
                    aspectRatio: '16 / 10',
                    backgroundImage: `url('${event.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FF5C2E',
                      color: '#0E0E12',
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{day}</span>
                    <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                      {month}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#A8A39A',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {event.doors} · {event.venue}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em',
                      marginBottom: '0.75rem',
                      color: '#F5F0E8',
                    }}
                  >
                    {event.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 999,
                        border: '1px solid #7BD4F5',
                        color: '#7BD4F5',
                      }}
                    >
                      {event.genre}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: '#F5F0E8' }}>
                      {event.price}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
