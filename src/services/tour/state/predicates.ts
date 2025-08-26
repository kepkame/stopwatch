import type { Store } from '@reduxjs/toolkit';

// Root store state alias.
type AppState = ReturnType<Store['getState']>;

/**
 * True if stopwatch is running.
 * Onboarding steps depend on active timer.
 */
export const isRunning = (state: AppState) => state.stopwatch.status === 'running';

/**
 * Predicate factory: resolves once laps length ≥ minLaps.
 * Ensures progress via Redux state, not just DOM.
 */
export const hasAtLeastNLaps = (minLaps: number) => (state: AppState) =>
  state.stopwatch.laps.length >= minLaps;

/**
 * Predicate factory: latest lap color differs from baseline.
 * "Grouping" step completes once colorIndex changes.
 */
export const latestLapColorChangedFrom = (initialColor: number | null) => (state: AppState) => {
  const lapsList = state.stopwatch.laps;
  const latestLap = lapsList[lapsList.length - 1];
  // Short-circuit: no lap or null baseline → false.
  // Equality check suffices. Wrap-around handled by action.
  return latestLap && initialColor !== null && latestLap.colorIndex !== initialColor;
};
