import { useState } from 'react';

// React island #2 — Reserve a Table.
//
// This entire form is the island: input state, validation, the
// success message after submit, the reset action. None of this works
// without React on the page. The surrounding section heading and
// intro paragraph are static HTML rendered by Astro.

interface FormState {
  name: string;
  email: string;
  partySize: string;
  date: string;
  time: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  partySize: '2',
  date: '',
  time: '18:00',
};

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function ReserveTable() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.date) return;
    setSubmitted(form);
  }

  function reset() {
    setForm(initialState);
    setSubmitted(null);
  }

  if (submitted) {
    const partyLabel = submitted.partySize === '1' ? '1 person' : `${submitted.partySize} people`;
    const dateLabel = new Date(submitted.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    return (
      <div className="reserve-form__success" role="status" aria-live="polite">
        <div className="reserve-form__success-icon" aria-hidden="true">
          🥖
        </div>
        <h3 className="reserve-form__success-title">Table held, {submitted.name.split(' ')[0]}</h3>
        <p className="reserve-form__success-body">
          We&rsquo;ve got you on the list. A confirmation will land at{' '}
          <strong>{submitted.email}</strong> in a few minutes.
        </p>
        <div className="reserve-form__success-detail">
          {dateLabel} · {submitted.time} · {partyLabel}
        </div>
        <div>
          <button type="button" className="reserve-form__reset" onClick={reset}>
            Make another reservation
          </button>
        </div>
      </div>
    );
  }

  const minDate = todayPlus(0);
  const isReady = form.name && form.email && form.date;

  return (
    <form className="reserve-form" onSubmit={handleSubmit} noValidate>
      <div className="reserve-form__grid">
        <div className="reserve-form__field reserve-form__field--full">
          <label className="reserve-form__label" htmlFor="r-name">
            Your name
          </label>
          <input
            id="r-name"
            className="reserve-form__input"
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Jordan Lee"
          />
        </div>

        <div className="reserve-form__field reserve-form__field--full">
          <label className="reserve-form__label" htmlFor="r-email">
            Email
          </label>
          <input
            id="r-email"
            className="reserve-form__input"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="jordan@example.com"
          />
        </div>

        <div className="reserve-form__field">
          <label className="reserve-form__label" htmlFor="r-party">
            Party size
          </label>
          <select
            id="r-party"
            className="reserve-form__select"
            value={form.partySize}
            onChange={(e) => update('partySize', e.target.value)}
          >
            <option value="1">1 person</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5">5 people</option>
            <option value="6">6 people</option>
          </select>
        </div>

        <div className="reserve-form__field">
          <label className="reserve-form__label" htmlFor="r-time">
            Time
          </label>
          <select
            id="r-time"
            className="reserve-form__select"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          >
            <option value="08:00">8:00 AM</option>
            <option value="09:30">9:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="19:30">7:30 PM</option>
          </select>
        </div>

        <div className="reserve-form__field reserve-form__field--full">
          <label className="reserve-form__label" htmlFor="r-date">
            Date
          </label>
          <input
            id="r-date"
            className="reserve-form__input"
            type="date"
            required
            min={minDate}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="reserve-form__submit"
        disabled={!isReady}
        aria-disabled={!isReady}
      >
        {isReady ? 'Reserve table' : 'Fill in name, email, and date'}
      </button>
    </form>
  );
}
