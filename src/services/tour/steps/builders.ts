import { SELECTORS, TIMEOUTS } from '../config/constants';
import { clickOnce } from '../dom/domSimulations';
import { safeAdvance } from '../driver/driverProgress';
import {
  hasAtLeastNLaps,
  isRunning as isRunningPredicate,
  latestLapColorChangedFrom,
} from '../state/predicates';
import { addLapOnce, bumpLatestLapColor, ensureRunning } from '../state/stateActions';
import type { StepDefinition } from '../types';
import { waitForContentChange } from '../waiters/changeWatchers';
import { waitForDomEvent, waitForRedux, waitForSelector } from '../waiters/waiters';
import type { StepDeps } from './types';

/** Stable numeric ids for steps */
export const StepId = {
  Start: 0,
  Lap: 1,
  Group: 2,
  SwitchTime: 3,
  Settings: 4,
} as const;

/**
 * Ensures an action runs at most once per visual activation of a step.
 * Rationale: driver.js can re-fire handlers on re-renders; we gate by adapter activation version
 * and only when the currently active step index matches `stepIndex`.
 */
const oncePerActivation = (stepDeps: StepDeps, stepIndex: number, action: () => void) => {
  let seenVersion = -1;
  return () => {
    const currentVersion = stepDeps.getAdapter?.()?.getActivationVersion?.() ?? 0;
    if (currentVersion === seenVersion) return;
    // Guard against accidental invocation while another step is active.
    const activeIndex = stepDeps.getAdapter?.()?.getIndex?.() ?? 0;
    if (activeIndex !== stepIndex) return;

    seenVersion = currentVersion;
    action();
  };
};

/**
 * Step 1: start the stopwatch.
 */
export const buildStartStep = (stepDeps: StepDeps): StepDefinition => ({
  element: SELECTORS.playOrFallback,
  popover: {
    title: 'Start',
    description:
      'Tap Play to start the stopwatch. After starting, the Pause and Lap buttons will appear.',
    side: 'bottom',
    align: 'center',
    onNextClick: oncePerActivation(stepDeps, StepId.Start, () => {
      // Immediate state mutation via Redux (no DOM dependency).
      ensureRunning(stepDeps.store);

      // Resolve on either DOM evidence (latest lap element) or Redux predicate.
      (async () => {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), TIMEOUTS.appear);
        try {
          try {
            await waitForSelector(SELECTORS.lapBtn, abortController.signal);
          } catch {
            // we allow the tour to continue to avoid hard lock.
          }
          safeAdvance(stepDeps.getAdapter?.(), StepId.Start);
        } finally {
          clearTimeout(timeoutId);
        }
      })();
    }),
  },
  // Complete when Redux reports the stopwatch is running;
  // this avoids relying purely on DOM timing.
  awaitCondition: (signal) =>
    waitForRedux(stepDeps.store.getState, stepDeps.store.subscribe, isRunningPredicate, signal),
});

/**
 * Step 2: add a lap.
 */
export const buildLapStep = (stepDeps: StepDeps): StepDefinition => ({
  element: SELECTORS.lapBtn,
  popover: {
    title: 'Lap',
    description: 'Tap Lap to record the current lap – an entry will be added to the list.',
    side: 'top',
    align: 'center',
    onNextClick: oncePerActivation(stepDeps, StepId.Lap, () => {
      // Programmatically dispatch the same effect as pressing Lap.
      addLapOnce(stepDeps.store);

      // Resolve on either DOM evidence (latest lap element) or Redux predicate.
      (async () => {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), TIMEOUTS.lapDomOrState);
        try {
          try {
            await waitForSelector(SELECTORS.latestLap, abortController.signal);
          } catch {
            try {
              await waitForRedux(
                stepDeps.store.getState,
                stepDeps.store.subscribe,
                hasAtLeastNLaps(2),
                abortController.signal,
              );
            } catch {
              // we allow the tour to continue to avoid hard lock.
            }
          }
          safeAdvance(stepDeps.getAdapter?.(), StepId.Lap);
        } finally {
          clearTimeout(timeoutId);
        }
      })();
    }),
  },
  // Hard condition for step completion: at least 2 laps (initial + newly added).
  awaitCondition: (signal) =>
    waitForRedux(stepDeps.store.getState, stepDeps.store.subscribe, hasAtLeastNLaps(2), signal),
});

/**
 * Step 3: grouping by changing the latest lap color.
 */
export const buildGroupStep = (stepDeps: StepDeps): StepDefinition => ({
  element: SELECTORS.latestLap,
  popover: {
    title: 'Grouping Attempts',
    description: `Each Lap shows: on the left – its number, in the center – the total time, on the right – the lap time. Swipe the top Lap or press the <span class="arrow">←</span> / <span class="arrow">→</span> keys to change its color and group your sets.`,
    side: 'right',
    align: 'center',
    onNextClick: oncePerActivation(stepDeps, StepId.Group, () => {
      (async () => {
        try {
          // Must ensure the latest-lap element exists; no timeout here because step is mandatory.
          await waitForSelector(SELECTORS.latestLap);

          // Snapshot color before mutation. If no latest lap, keep the tour safe and bail.
          const lapsBefore = stepDeps.store.getState().stopwatch.laps;
          const latestBefore = lapsBefore[lapsBefore.length - 1];
          if (!latestBefore) {
            // Defensive: should not happen if previous step completed
            console.warn('[tour] Group step: no latest lap found');
            return;
          }
          const initialColor = latestBefore.colorIndex;

          bumpLatestLapColor(stepDeps.store);

          await waitForRedux(
            stepDeps.store.getState,
            stepDeps.store.subscribe,
            latestLapColorChangedFrom(initialColor),
          );

          safeAdvance(stepDeps.getAdapter?.(), StepId.Group);
        } catch (error) {
          console.warn('[tour] Group step: waiting for color change failed or was aborted', error);
        }
      })();
    }),
  },
  awaitCondition: async (signal) => {
    await waitForSelector(SELECTORS.latestLap, signal);

    // Lock onto the specific baseline color to compare future changes against.
    const laps = stepDeps.store.getState().stopwatch.laps;
    const latest = laps[laps.length - 1];
    const initialColor = latest?.colorIndex ?? null;

    await waitForRedux(
      stepDeps.store.getState,
      stepDeps.store.subscribe,
      latestLapColorChangedFrom(initialColor),
      signal,
    );
  },
});

/**
 * Step 4: switch the main time mode via a tap.
 */
export const buildSwitchTimeStep = (stepDeps: StepDeps): StepDefinition => ({
  element: SELECTORS.timer,
  popover: {
    title: 'Switching Time',
    description:
      'Tap the large timer to switch modes: total time, last lap, and countdown to the signal.',
    side: 'bottom',
    align: 'center',
    onNextClick: oncePerActivation(stepDeps, StepId.SwitchTime, () => {
      (async () => {
        const abortController = new AbortController();
        // Short timeout: users can be idle; we avoid blocking the tour forever.
        const timeoutId = setTimeout(() => abortController.abort(), TIMEOUTS.watchSwitch);
        try {
          // Prefer selector wait; fall back to a direct query if wait was aborted.
          const timerElement = await (async () => {
            try {
              return await waitForSelector(SELECTORS.timer, abortController.signal);
            } catch {
              return document.querySelector(SELECTORS.timer);
            }
          })();
          if (timerElement) {
            // Snapshot reduces flakiness: either textContent or aria-label can change.
            const snapshot = (
              timerElement.getAttribute('aria-label') ??
              timerElement.textContent ??
              ''
            ).trim();

            // Simulate a single user action and wait for a content change signal.
            clickOnce(timerElement);
            try {
              await waitForContentChange(timerElement, snapshot, abortController.signal);
            } catch {
              // Continue even if content did not change within timeout.
            }
          }

          safeAdvance(stepDeps.getAdapter?.(), StepId.SwitchTime);
        } finally {
          clearTimeout(timeoutId);
        }
      })();
    }),
  },
  // Keep an interaction wait for parity with UX: click or keyboard is acceptable.
  awaitCondition: async (signal) => {
    const timerElement = await waitForSelector(SELECTORS.timer, signal);
    await waitForDomEvent(timerElement, ['click', 'keydown'], signal);
  },
});

/**
 * Step 5: open settings.
 */
export const buildSettingsStep = (stepDeps: StepDeps): StepDefinition => ({
  element: SELECTORS.settings,
  popover: {
    title: 'Settings',
    description:
      'Here you can configure Sound Notification, Change Time by Tap, Keep Screen On, and the theme color.',
    side: 'left',
    align: 'center',
  },
  awaitCondition: async (signal) => {
    // DOM must have the settings trigger; otherwise Promise.race below would be unreliable.
    const settingsButton = await waitForSelector(SELECTORS.settings, signal);

    // Accept either direct user click or Redux flag indicating the modal opened.
    await Promise.race([
      waitForDomEvent(settingsButton, ['click'], signal),
      waitForRedux(
        stepDeps.store.getState,
        stepDeps.store.subscribe,
        (state) => state.settings.isOpen === true,
        signal,
      ),
    ]);

    // End tour immediately; we skip "Done" screen to reduce friction.
    try {
      stepDeps.getAdapter?.()?.teardown();
    } catch {
      // Intentionally swallow teardown errors:
      // teardown is best-effort and not critical for UX.
    }
  },
});
