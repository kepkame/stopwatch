import { DEFAULT_CLOSE_SVG } from '../config/constants';
import type { DriverUserOptions, StepDefinition } from '../types';

export const isBrowserEnv = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

export const clampIndex = (index: number, length: number): number =>
  Math.max(0, Math.min(length - 1, index));

type PopoverDomLike = {
  closeButton?: HTMLElement | null;
};

// Safe injection into a known close button element (popover.closeButton).
const injectIntoPopoverClose = (
  closeBtn: HTMLElement | null | undefined,
  svg = DEFAULT_CLOSE_SVG,
) => {
  try {
    if (!closeBtn) return;
    if (closeBtn.querySelector('svg')) return;

    closeBtn.innerHTML = svg;
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.setProperty('place-items', 'center');
  } catch {
    // Safe fallback: do nothing if DOM injection fails.
  }
};

// Query by class if popover API doesn't expose closeButton.
const injectByQuerySelector = (svg = DEFAULT_CLOSE_SVG) => {
  try {
    const btn = document.querySelector('.driver-popover-close-btn') as HTMLElement | null;
    injectIntoPopoverClose(btn, svg);
  } catch {
    // Ignore DOM access errors.
  }
};

/**
 * Builds driver.js options with defaults and step mapping.
 * Rationale: centralizes driver config and patches close button rendering across versions.
 */
export const toDriverOptions = (
  steps: StepDefinition[],
  extraOptions?: Partial<DriverUserOptions>,
): DriverUserOptions => {
  // If no steps — still return minimal options (caller likely will not call).
  const baseOptions: Record<string, unknown> = {
    showProgress: true,
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Done',
    closeBtnText: '',
    stagePadding: 6,
    allowClose: true,
    overlayClickBehavior: 'none',
    steps: steps.map((step) => ({ element: step.element, popover: step.popover })),

    // Use driver.js hook to inject custom close button SVG.
    onPopoverRender: (popover?: PopoverDomLike) => {
      try {
        const closeBtn = popover?.closeButton as HTMLElement | undefined | null;
        injectIntoPopoverClose(closeBtn);
      } catch {
        // Ignore handler errors.
      }
    },

    // Backup injection if onPopoverRender is missing. Runs after highlight DOM attaches.
    onHighlightStarted: () => {
      try {
        queueMicrotask(() => injectByQuerySelector());
      } catch {
        // Ignore scheduling errors.
      }
    },
  };

  // Extra options override defaults.
  return {
    ...baseOptions,
    ...(extraOptions ?? {}),
  } as unknown as DriverUserOptions;
};

/**
 * Safely destroy adapter, swallowing vendor errors.
 */
export const safeTeardown = (adapter?: { teardown?: () => void } | null): void => {
  try {
    adapter?.teardown?.();
  } catch {
    // Ignore vendor teardown errors.
  }
};
