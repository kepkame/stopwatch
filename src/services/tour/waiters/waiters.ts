import type { CssSelector } from '../types';

/**
 * Attach AbortSignal listener, return cleanup fn.
 * Ensures consistent abort handling across waiters.
 */
const registerAbortListener = (
  signal: AbortSignal | undefined,
  onAbort: () => void,
): (() => void) => {
  if (!signal) return () => {};
  const abortHandler = () => onAbort();
  signal.addEventListener('abort', abortHandler, { once: true });
  return () => signal.removeEventListener('abort', abortHandler);
};

// Safe check to avoid undefined signal issues.
const hasBeenAborted = (signal?: AbortSignal): boolean => Boolean(signal?.aborted);

// requestAnimationFrame tick to align checks with DOM updates, cheaper than polling.
const nextAnimationFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

/**
 * Wait until selector exists in DOM.
 * Combines MutationObserver, requestAnimationFrame loop, and AbortSignal.
 */
export const waitForSelector = async (
  selector: CssSelector,
  signal?: AbortSignal,
): Promise<Element> => {
  if (hasBeenAborted(signal)) throw new DOMException('Aborted', 'AbortError');

  const existingElement = document.querySelector(selector);
  if (existingElement) return existingElement;

  // Exposed promise for external resolution/rejection.
  let resolveFoundElement!: (found: Element) => void;
  let rejectElementPromise!: (error: Error) => void;
  const elementPromise = new Promise<Element>((resolve, reject) => {
    resolveFoundElement = resolve;
    rejectElementPromise = reject;
  });

  // Observe DOM mutations to detect element attach.
  const mutationObserver = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      mutationObserver.disconnect();
      resolveFoundElement(element);
    }
  });

  // Abort cancels observer and rejects promise.
  const removeAbortListener = registerAbortListener(signal, () => {
    try {
      mutationObserver.disconnect();
    } catch {
      // Tolerate double-disconnect.
    }
    rejectElementPromise(new DOMException('Aborted', 'AbortError'));
  });

  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // requestAnimationFrame loop fallback if observer misses late changes.
  (async () => {
    while (true) {
      await nextAnimationFrame();
      if (hasBeenAborted(signal)) {
        removeAbortListener();
        return;
      }
      const element = document.querySelector(selector);
      if (element) {
        try {
          mutationObserver.disconnect();
        } catch {
          // Ignore races
        }
        removeAbortListener();
        resolveFoundElement(element);
        return;
      }
    }
  })();

  return elementPromise;
};

/**
 * Resolve on first DOM event from eventNames.
 * Supports abort for safe cleanup.
 */
export const waitForDomEvent = async (
  targetElement: Element,
  eventNames: readonly string[],
  signal?: AbortSignal,
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (hasBeenAborted(signal)) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    let settled = false;

    // Cleanup callback invoked if signal aborts.
    const removeAbortListener = registerAbortListener(signal, () => {
      if (settled) return;
      settled = true;
      teardownListeners();
      reject(new DOMException('Aborted', 'AbortError'));
    });

    // One-shot listeners for all events, resolve on first hit.
    const eventSubscriptions = eventNames.map((eventName) => {
      const handler = () => {
        if (settled) return;
        settled = true;
        teardownListeners();
        resolve();
      };
      targetElement.addEventListener(eventName, handler, { once: true });
      return { eventName, handler };
    });

    // Cleanup ensures no dangling listeners or timers
    const teardownListeners = () => {
      eventSubscriptions.forEach(({ eventName, handler }) =>
        targetElement.removeEventListener(eventName, handler),
      );
      removeAbortListener();
    };
  });

/**
 * Resolve when Redux predicate passes.
 * Unsubscribes automatically and supports abort.
 */
export const waitForRedux = async <State>(
  getState: () => State,
  subscribe: (listener: () => void) => () => void,
  predicate: (state: State) => boolean,
  signal?: AbortSignal,
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    // Resolve immediately if predicate already satisfied.
    if (predicate(getState())) {
      resolve();
      return;
    }
    if (hasBeenAborted(signal)) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    // Subscribe to Redux store updates and resolve when predicate passes.
    const unsubscribe = subscribe(() => {
      if (predicate(getState())) {
        unsubscribe();
        resolve();
      }
    });

    // Abort stops subscription and rejects.
    const removeAbortListener = registerAbortListener(signal, () => {
      try {
        unsubscribe();
      } catch {
        // Ignore store quirks
      }
      reject(new DOMException('Aborted', 'AbortError'));
    });

    // Covers race where predicate becomes true right after setup.
    if (predicate(getState())) {
      try {
        unsubscribe();
      } catch {
        // Ignore double-unsubscribe
      }
      removeAbortListener();
      resolve();
    }
  });
