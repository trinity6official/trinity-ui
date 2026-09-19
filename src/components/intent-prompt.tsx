'use client';

import { type FormEvent, useState } from 'react';

export function IntentPrompt() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  return (
    <div>
      <form className="intentForm" onSubmit={handleSubmit}>
        <label htmlFor="intent" className="srOnly">What do you want to do?</label>
        <input id="intent" name="intent" type="text" autoComplete="off" placeholder="What do you want to do?" onChange={() => setSubmitted(false)} />
        <button type="submit">Continue</button>
      </form>
      <p className="intentHint" aria-live="polite">{submitted ? 'Foundation only: the interactive world and Trinity connection arrive in later phases.' : 'Ask naturally. This control is intentionally local until the Trinity service boundary is implemented.'}</p>
    </div>
  );
}
