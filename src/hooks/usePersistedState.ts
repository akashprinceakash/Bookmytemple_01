import { useEffect, useRef, useState } from 'react';

/**
 * Drop-in replacement for `useState` that mirrors the value to
 * `sessionStorage` under `key` and rehydrates from it on mount.
 *
 * Why this is needed: React Router unmounts a route's component when you
 * navigate away from it and remounts a fresh instance when you navigate
 * back to it (browser Back included) — plain `useState` has no memory of
 * what the user typed/selected before they left. That's what was making
 * multi-step flows (date/slot pickers, puja participant/add-on
 * selections, the login phone field) appear to "lose" everything on
 * Back even though the URL history itself was navigating correctly.
 *
 * Scope is per browser tab (sessionStorage) and is intentionally NOT
 * used for anything sensitive (OTP codes, tokens) — only for in-progress
 * selections the user would be annoyed to have to redo.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Avoid clobbering sessionStorage with the initial value before the
  // lazy-init read above has had a chance to run.
  const hydrated = useRef(true);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage can throw in private-browsing/quota edge cases —
      // losing persistence isn't worth crashing the page over.
    }
  }, [key, state]);

  return [state, setState];
}

/** Clears every key belonging to a given flow, e.g. after it completes. */
export function clearPersistedState(keys: string[]) {
  keys.forEach((key) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}