import type { Store } from '@reduxjs/toolkit';
import { createDriverAdapterLazy } from '../adapter/adapter.lazy';
import { safeAdvance } from '../driver/driverProgress';
import { loadState, saveState } from '../persistence/storage';
import { createSteps } from '../steps/index';
import type {
  DriverAdapter,
  DriverUserOptions,
  OnboardingController,
  StepDefinition,
} from '../types';
import { waitForSelector } from '../waiters/waiters';
import { clampIndex, isBrowserEnv, safeTeardown, toDriverOptions } from './controller.utils';

type Dependencies = {
  store: Store;
  driverConfig?: Partial<DriverUserOptions>;
};

type ControllerState = {
  running: boolean;
  abortController: AbortController | null;
  adapter: DriverAdapter | null;
};

// Skip tour if already completed unless forced.
const isCompletedAndNotForced = (force?: boolean): boolean => {
  const { completed } = loadState();
  return completed === true && !force;
};

// Normalize vendor teardown to a single cleanup call.
const attachLifecycle = (adapter: DriverAdapter, cleanup: () => void): void => {
  adapter.onDestroyed(() => {
    cleanup();
  });
};

// Load driver.js only after the first step target exists.
const initAdapter = async (
  steps: StepDefinition[],
  driverConfig?: Partial<DriverUserOptions>,
  abortSignal?: AbortSignal,
): Promise<DriverAdapter | null> => {
  if (steps.length === 0) return null;

  try {
    await waitForSelector(steps[0].element, abortSignal);
  } catch {
    // If cancelled or timed out before the first element appears, do not initialize the driver.
    return null;
  }

  try {
    const adapter = await createDriverAdapterLazy(toDriverOptions(steps, driverConfig));
    if (abortSignal?.aborted) {
      // If cancelled post-load, teardown to avoid leaks.
      safeTeardown(adapter);
      return null;
    }
    return adapter;
  } catch (error) {
    // Driver assets failed to load
    console.error('Failed to load onboarding driver:', error);
    return null;
  }
};

/**
 * Creates a tour controller bound to Redux and Driver.js.
 * Single place for lifecycle, cancellation, and safe step flow.
 */
export const createOnboardingController = ({
  store,
  driverConfig = {},
}: Dependencies): OnboardingController => {
  const state: ControllerState = {
    running: false,
    abortController: null,
    adapter: null,
  };

  // Idempotent teardown: abort waits and destroy adapter.
  const cleanup = (): void => {
    try {
      state.abortController?.abort();
    } catch {
      // Ignore AbortController quirks.
    } finally {
      state.abortController = null;
    }

    safeTeardown(state.adapter);
    state.adapter = null;
    state.running = false;
  };

  // Orchestrates the full tour; re-entrant safe and supports "force".
  const start = async (opts?: { force?: boolean; startIndex?: number }): Promise<void> => {
    if (!isBrowserEnv()) return; // SSR/Node: no-op.
    if (state.running) return; // Prevent double start.

    const startOptions = opts;

    if (isCompletedAndNotForced(startOptions?.force)) return;

    state.running = true;
    state.abortController = new AbortController();

    try {
      const steps = createSteps(store, {
        getAdapter: () => state.adapter,
      });

      if (steps.length === 0) {
        cleanup();
        return;
      }

      // Clamp to avoid vendor OOB navigation.
      const startIndex = clampIndex(startOptions?.startIndex ?? 0, steps.length);

      // Lazy-init driver.
      const adapter = await initAdapter(steps, driverConfig, state.abortController.signal);
      if (!adapter) {
        cleanup();
        return;
      }

      state.adapter = adapter;
      attachLifecycle(adapter, cleanup);

      // Start visuals
      adapter.start(startIndex);

      // Sequentially wait each step's condition.
      for (let i = startIndex; i < steps.length; i += 1) {
        const isLast = i === steps.length - 1;
        const step = steps[i];

        // Persist completion as soon as last step activates.
        if (isLast) saveState({ completed: true });

        try {
          await waitForSelector(step.element, state.abortController.signal);
          await step.awaitCondition(state.abortController.signal);
        } catch {
          // Abort/timeout
          return;
        }

        if (isLast) {
          // Try to show "Done"; safe if unsupported.
          try {
            adapter.next();
          } catch {
            // Ignore vendor inconsistencies.
          }
          return;
        }

        // Defensive advance to avoid desync/double-next.
        safeAdvance(adapter, i);
      }
    } finally {
      cleanup();
    }
  };

  // Fire-and-forget start gated by persisted state.
  const maybeStart = (): void => {
    if (isCompletedAndNotForced(false)) return;
    void start({ startIndex: 0 });
  };

  // External hard stop
  const stop = (): void => {
    cleanup();
  };

  return {
    start,
    maybeStart,
    stop,
  };
};
