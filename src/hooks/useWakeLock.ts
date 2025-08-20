import { useEffect } from 'react';
import { acquireWakeLock, releaseWakeLock } from '@services/wakeLock';

/**
 * Keeps the screen awake on while active is true.
 * Automatically re-requests the lock when returning to the tab/focus.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    // SSR/isomorphic environments: exit immediately
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    let disposed = false;

    const sync = async () => {
      if (disposed) return;
      if (active && document.visibilityState === 'visible') {
        await acquireWakeLock();
      } else {
        await releaseWakeLock();
      }
    };

    void sync();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && active) {
        void acquireWakeLock();
      } else {
        void releaseWakeLock();
      }
    };

    const onWindowFocus = () => {
      if (active) void acquireWakeLock();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onWindowFocus);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onWindowFocus);
      void releaseWakeLock();
    };
  }, [active]);
}
