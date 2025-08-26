/**
 * Await until an element's user-visible content changes.
 */
export const waitForContentChange = async (
  element: Element,
  initialSnapshot: string,
  signal?: AbortSignal,
): Promise<void> =>
  new Promise((resolve, reject) => {
    // Abort early to mirror standard AbortError behavior.
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));

    // Prefer ARIA label; fall back to text.
    const getContent = () =>
      (element.getAttribute('aria-label') ?? element.textContent ?? '').trim();

    // If already changed since snapshot, resolve immediately (avoids races).
    if (getContent() !== initialSnapshot) return resolve();

    // Use MutationObserver (not polling) for low overhead and deterministic updates.
    const mutationObserver = new MutationObserver(() => {
      if (getContent() !== initialSnapshot) {
        try {
          mutationObserver.disconnect();
        } catch {
          // Swallow to keep promise resolution reliable across browsers.
        }
        resolve();
      }
    });

    const cleanup = () => {
      try {
        mutationObserver.disconnect();
      } catch {
        // Best-effort cleanup; safe to ignore if already disconnected.
      }
    };

    // Propagate cancellation via AbortSignal with a DOM-standard error.
    signal?.addEventListener(
      'abort',
      () => {
        cleanup();
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );

    // Observe text and aria-label changes; limit attribute noise via filter.
    mutationObserver.observe(element, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label'],
    });
  });
