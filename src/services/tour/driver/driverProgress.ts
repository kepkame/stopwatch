import type { DriverAdapter } from '../types';

/**
 * Safely move the tour to the next step.
 * Prevents double-advance by checking current index and may restart at `currentStepIndex + 1` if driver already advanced.
 */
export const safeAdvance = (
  driverAdapter: DriverAdapter | null | undefined,
  currentStepIndex: number,
): void => {
  if (!driverAdapter) return;

  let activeIndex = 0;

  try {
    activeIndex = driverAdapter.getIndex?.() ?? 0;
  } catch {
    activeIndex = 0;
  }

  // If still at or before current step, go next; if ahead, resync by restarting at next index.
  if (activeIndex <= currentStepIndex) {
    try {
      driverAdapter.next();
    } catch {
      // Ignore vendor API absence
    }
  } else {
    try {
      driverAdapter.start(currentStepIndex + 1);
    } catch {
      // Ignore vendor API differences
    }
  }
};
