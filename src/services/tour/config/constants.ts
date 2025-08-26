export const LS_KEY = 'onboardingTour.v1' as const;

export const SELECTORS = {
  play: '[data-tour="play"]',
  playOrFallback: '[data-tour="play"], [data-tour="pause"]',
  lapBtn: '[data-tour="add-lap"]',
  timer: '[data-tour="timer-display"]',
  latestLap: '[data-tour="lap-item-latest"]',
  settings: '[data-tour="open-settings"]',
} as const;

export const TIMEOUTS = {
  appear: 2500,
  lapDomOrState: 2000,
  watchSwitch: 2000,
} as const;

export const DEFAULT_CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
