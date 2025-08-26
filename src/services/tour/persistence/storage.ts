import { LS_KEY } from '../config/constants';
import type { PersistedTourState } from '../types';

/**
 * Loads onboarding-tour state from localStorage.
 * Falls back to empty object if data is missing, invalid, or legacy.
 */
export const loadState = (): PersistedTourState => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    // Remove legacy schema with `dismissedAtStep`.
    if ('dismissedAtStep' in parsed) {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        // Ignore storage errors
      }
      return {};
    }

    // Only persist `{ completed: true }`; otherwise clear.
    if (parsed?.completed !== true) {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        // ignore
      }
      return {};
    }
    return { completed: true };
  } catch {
    // On parse/storage error return empty state.
    return {};
  }
};

/**
 * Persists minimal tour state in localStorage.
 * Stores only `{ completed: true }`, otherwise clears.
 */
export const saveState = (next: PersistedTourState): void => {
  try {
    if (next.completed === true) {
      localStorage.setItem(LS_KEY, JSON.stringify({ completed: true }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  } catch {
    // Swallow storage errors (quota, blocked context, private mode) to avoid impacting app UX.
  }
};
