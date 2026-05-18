import { useState, useEffect } from 'react';

interface Props {
  eventId: string;
  eventTitle: string;
}

type RSVPStatus = 'none' | 'going' | 'maybe';

const STORAGE_KEY = 'after-hours-rsvps';

function loadRSVPs(): Record<string, RSVPStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRSVPs(rsvps: Record<string, RSVPStatus>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
}

export default function RSVPButton({ eventId, eventTitle }: Props) {
  const [status, setStatus] = useState<RSVPStatus>('none');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rsvps = loadRSVPs();
    setStatus(rsvps[eventId] || 'none');
    setHydrated(true);
  }, [eventId]);

  function update(next: RSVPStatus) {
    const rsvps = loadRSVPs();
    if (next === 'none') {
      delete rsvps[eventId];
    } else {
      rsvps[eventId] = next;
    }
    saveRSVPs(rsvps);
    setStatus(next);
  }

  const baseStyle: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.02em',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid',
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  };

  const goingStyle: React.CSSProperties =
    status === 'going'
      ? { ...baseStyle, background: '#5BE39B', color: '#0E0E12', borderColor: '#5BE39B' }
      : { ...baseStyle, background: 'transparent', color: '#F5F0E8', borderColor: 'rgba(255,255,255,0.16)' };

  const maybeStyle: React.CSSProperties =
    status === 'maybe'
      ? { ...baseStyle, background: '#FF5C2E', color: '#0E0E12', borderColor: '#FF5C2E' }
      : { ...baseStyle, background: 'transparent', color: '#F5F0E8', borderColor: 'rgba(255,255,255,0.16)' };

  if (!hydrated) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div style={{ ...baseStyle, color: 'rgba(168,163,154,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>RSVP</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button
          style={goingStyle}
          onClick={() => update(status === 'going' ? 'none' : 'going')}
          aria-pressed={status === 'going'}
          aria-label={`RSVP going to ${eventTitle}`}
        >
          {status === 'going' ? '✓ Going' : '+ Going'}
        </button>
        <button
          style={maybeStyle}
          onClick={() => update(status === 'maybe' ? 'none' : 'maybe')}
          aria-pressed={status === 'maybe'}
          aria-label={`RSVP maybe to ${eventTitle}`}
        >
          {status === 'maybe' ? '? Maybe' : '? Maybe'}
        </button>
      </div>
      {status !== 'none' && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#A8A39A',
            marginTop: '0.75rem',
            textAlign: 'center',
          }}
        >
          Saved to your device · localStorage
        </div>
      )}
    </div>
  );
}
