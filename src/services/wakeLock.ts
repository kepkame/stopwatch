let sentinel: WakeLockSentinel | null = null;

/** API support check */
export const isWakeLockSupported = (): boolean =>
  typeof navigator !== 'undefined' && 'wakeLock' in navigator;

/**
 * Requests screen wake lock.
 * Returns true if the lock was successfully acquired (or was already active).
 */
export async function acquireWakeLock(): Promise<boolean> {
  try {
    if (!isWakeLockSupported()) return false;
    if (sentinel && !sentinel.released) return true;

    const s = await navigator.wakeLock.request('screen');

    // If the lock was released (tab hidden, etc.), reset the reference
    s.addEventListener('release', () => {
      sentinel = null;
    });

    sentinel = s;
    return true;
  } catch {
    sentinel = null;
    return false;
  }
}

/** Releases the screen wake lock (if it was active) */
export async function releaseWakeLock(): Promise<void> {
  try {
    if (sentinel && !sentinel.released) {
      await sentinel.release();
    }
  } catch {
    // Silently ignore
  } finally {
    sentinel = null;
  }
}

/** Current actual activity of the lock sentinel */
export const isWakeLocked = (): boolean =>
  sentinel != null && sentinel.released === false;
