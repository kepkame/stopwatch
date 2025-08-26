import type { DriverAdapter, RawDriverInstance } from '../types';

type LifecycleMethodName = 'destroy' | 'reset' | 'stop' | 'close' | 'cancel';
type DestroyEventName = 'destroyed' | LifecycleMethodName;
type StepEventName = 'highlightStarted' | 'highlighted' | 'stepChanged' | 'next' | 'previous';

type VoidFn = () => void;

/**
 * Cross-version surface of driver.js we rely on.
 * Different builds expose different lifecycle/navigation APIs.
 */
type DriverInstanceExtended = RawDriverInstance & {
  on?: (event: DestroyEventName | StepEventName, callback: (eventData?: unknown) => void) => void;
} & Record<LifecycleMethodName, VoidFn | undefined> & {
    movePrevious?: () => void;
    movePrev?: () => void;
    moveBack?: () => void;
    moveTo?: (index: number) => void;
  };

/** Read current active step index defensively. Fall back to 0 if API is absent or throws. */
const safeGetIndex = (instance: DriverInstanceExtended): number => {
  try {
    const indexCandidate = instance.getActiveIndex?.();
    return typeof indexCandidate === 'number' ? indexCandidate : 0;
  } catch {
    return 0;
  }
};

/** Defensive active step index read. Fallback 0 if unavailable. */
const queueMicro = (task: () => void): void => {
  try {
    queueMicrotask(task);
  } catch {
    Promise.resolve()
      .then(task)
      .catch(() => {});
  }
};

/**
 * Build a stable adapter around a raw driver.js instance.
 * Unify events/lifecycle across versions for tour controller.
 */
export const buildAdapterFromRaw = (rawDriver: RawDriverInstance): DriverAdapter => {
  const driverInstance = rawDriver as DriverInstanceExtended;

  // Single-fire "destroyed" state. Multiple events can trigger it.
  let isDestroyedNotified = false;
  let onDestroyedCallback: (() => void) | null = null;

  const notifyDestroyed = (): void => {
    if (isDestroyedNotified) return;
    isDestroyedNotified = true;
    try {
      onDestroyedCallback?.();
    } catch {
      // Swallow listener errors to avoid breaking teardown.
    } finally {
      onDestroyedCallback = null;
      onStepChangeCallback = null;
    }
  };

  // Subscribe to all known teardown events.
  if (typeof driverInstance.on === 'function') {
    (['destroyed', 'destroy', 'reset', 'stop', 'close', 'cancel'] as const).forEach((eventName) => {
      try {
        if (typeof driverInstance.on === 'function') {
          driverInstance.on(eventName, () => notifyDestroyed());
        }
      } catch {
        // Event may be unknown in a given build — safe to ignore.
      }
    });
  }

  // Wrap lifecycle methods to always notifyDestroyed.
  (['destroy', 'reset', 'stop', 'close', 'cancel'] as const).forEach(
    (methodName: LifecycleMethodName) => {
      const originalMethod = driverInstance[methodName];
      if (typeof originalMethod === 'function') {
        const wrappedMethod: VoidFn = function (this: unknown): void {
          notifyDestroyed();
          try {
            Reflect.apply(originalMethod as (...args: unknown[]) => unknown, this, []);
          } catch {
            // Ignore failures from vendor code.
          }
        };
        driverInstance[methodName] = wrappedMethod;
      }
    },
  );

  // ESC key closes the tour once.
  const escapeHandler = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' || event.key === 'Esc') notifyDestroyed();
  };
  document.addEventListener('keydown', escapeHandler, { once: true });

  // Safe invoke for optional callbacks.
  const safeCall = (maybeCallback: unknown): void => {
    if (typeof maybeCallback === 'function') {
      try {
        (maybeCallback as VoidFn)();
      } catch {
        // Ignore userland errors.
      }
    }
  };

  // Remove listeners when destroyed; chain previous handler.
  const previousOnDestroyed = onDestroyedCallback as unknown;
  onDestroyedCallback = (): void => {
    try {
      document.removeEventListener('keydown', escapeHandler);
    } catch {
      // No-op; DOM APIs may be unavailable in tests.
    } finally {
      safeCall(previousOnDestroyed);
    }
  };

  // Track step index changes with a version counter.
  let activationVersion = 0;
  let onStepChangeCallback: ((index: number) => void) | null = null;
  let lastIndex: number = safeGetIndex(driverInstance);

  const emitStepChange = (index: number): void => {
    activationVersion += 1;
    try {
      onStepChangeCallback?.(index);
    } catch {
      // Ignore user handlers.
    }
  };

  const bumpOnIndexChange = (): void => {
    const currentIndex = safeGetIndex(driverInstance);
    if (currentIndex !== lastIndex) {
      lastIndex = currentIndex;
      emitStepChange(currentIndex);
    }
  };

  // Subscribe to events indicating step transitions.
  if (typeof driverInstance.on === 'function') {
    (['highlightStarted', 'highlighted', 'stepChanged', 'next', 'previous'] as const).forEach(
      (eventName) => {
        try {
          if (typeof driverInstance.on === 'function') {
            driverInstance.on(eventName, () => {
              bumpOnIndexChange();
            });
          }
        } catch {
          // Event may be unsupported.
        }
      },
    );
  }

  // Wrap navigation methods to bump index after state updates.
  const wrapNavigation = (): void => {
    {
      const originalDrive = driverInstance.drive;
      if (typeof originalDrive === 'function') {
        driverInstance.drive = function (
          this: unknown,
          index?: number,
        ): ReturnType<typeof originalDrive> {
          try {
            return originalDrive.call(this, index);
          } finally {
            // Schedule after driver processes the move to observe the correct index.
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }

    // moveNext
    {
      const originalMoveNext = driverInstance.moveNext;
      if (typeof originalMoveNext === 'function') {
        driverInstance.moveNext = function (
          this: unknown,
        ): ReturnType<NonNullable<typeof originalMoveNext>> {
          try {
            return originalMoveNext.call(this);
          } finally {
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }

    // movePrevious
    {
      const originalMovePrevious = driverInstance.movePrevious;
      if (typeof originalMovePrevious === 'function') {
        driverInstance.movePrevious = function (
          this: unknown,
        ): ReturnType<NonNullable<typeof originalMovePrevious>> {
          try {
            return originalMovePrevious.call(this);
          } finally {
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }

    // movePrev
    {
      const originalMovePrev = driverInstance.movePrev;
      if (typeof originalMovePrev === 'function') {
        driverInstance.movePrev = function (
          this: unknown,
        ): ReturnType<NonNullable<typeof originalMovePrev>> {
          try {
            return originalMovePrev.call(this);
          } finally {
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }

    // moveBack
    {
      const originalMoveBack = driverInstance.moveBack;
      if (typeof originalMoveBack === 'function') {
        driverInstance.moveBack = function (
          this: unknown,
        ): ReturnType<NonNullable<typeof originalMoveBack>> {
          try {
            return originalMoveBack.call(this);
          } finally {
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }

    // moveTo
    {
      const originalMoveTo = driverInstance.moveTo;
      if (typeof originalMoveTo === 'function') {
        driverInstance.moveTo = function (
          this: unknown,
          index: number,
        ): ReturnType<NonNullable<typeof originalMoveTo>> {
          try {
            return originalMoveTo.call(this, index);
          } finally {
            queueMicro(bumpOnIndexChange);
          }
        };
      }
    }
  };

  wrapNavigation();

  // Adapter surface consumed by the onboarding controller.
  const adapter: DriverAdapter = {
    start: (index?: number): void => {
      try {
        driverInstance.drive(index);
      } catch {
        // Vendor method may be missing, adapter stays functional.
      }
    },
    next: (): void => {
      try {
        driverInstance.moveNext?.();
      } catch {
        // Tolerate missing method across versions.
      }
    },
    getIndex: (): number => safeGetIndex(driverInstance),
    onDestroyed: (callback: () => void): void => {
      // If already destroyed, invoke immediately to avoid missing teardown.
      if (isDestroyedNotified) {
        safeCall(callback);
        return;
      }
      // Chain with any previously provided handler.
      const previousCallback = onDestroyedCallback;
      onDestroyedCallback = (): void => {
        try {
          safeCall(previousCallback);
        } finally {
          safeCall(callback);
        }
      };
    },
    onStepChange: (callback: (index: number) => void): void => {
      onStepChangeCallback = callback ?? null;
    },
    getActivationVersion: (): number => activationVersion,
    teardown: (): void => {
      try {
        driverInstance.destroy?.();
      } catch {
        // Ignore vendor errors during cleanup.
      }
    },
  };

  return adapter;
};
