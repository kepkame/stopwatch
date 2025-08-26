/**
 * Simulate user interactions with DOM for the onboarding tour.
 * Uses real DOM events instead of external testing libraries.
 */

/** Simulate a real click: focus element if possible */
export const clickOnce = (element: Element): void => {
  (element as HTMLElement).focus?.();
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
};

/** Simulate a keydown event for the given key name */
export const keydown = (element: Element, keyName: string): void => {
  (element as HTMLElement).focus?.();
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: keyName,
      code: keyName,
      bubbles: true,
      cancelable: true,
    }),
  );
};
