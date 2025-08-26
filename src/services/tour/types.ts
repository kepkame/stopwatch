export type CssSelector = string;

/** State stored in localStorage to persist user progress through the onboarding tour */
export interface PersistedTourState {
  completed?: boolean;
}

export interface PopoverConfig {
  title: string;
  description: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  onNextClick?: () => void;
}

export interface StepDefinition {
  element: CssSelector;
  popover: PopoverConfig;
  awaitCondition: (signal?: AbortSignal) => Promise<void>;
}

/** Step shape expected by driver.js (use element selector + popover) */
export interface DriverStep {
  element: CssSelector;
  popover: PopoverConfig;
  [key: string]: unknown;
}

/** Minimal shape of user options passed to driver.js constructor/factory */
export interface DriverUserOptions {
  showProgress?: boolean;
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;
  closeBtnText?: string;
  stagePadding?: number;
  allowClose?: boolean;
  overlayClickBehavior?: 'none' | 'close';
  steps?: DriverStep[];
}

/** Minimal contract of the driver.js instance we rely on */
export interface RawDriverInstance {
  drive: (index?: number) => void;
  moveNext?: () => void;
  destroy?: () => void;
  reset?: () => void;
  stop?: () => void;
  close?: () => void;
  cancel?: () => void;
  getActiveIndex?: () => number;
  on?: (event: 'destroyed', callback: () => void) => void;
}

/** Stable adapter abstraction around driver.js */
export interface DriverAdapter {
  start: (index?: number) => void;
  next: () => void;
  getIndex: () => number;
  onDestroyed: (callback: () => void) => void;
  teardown: () => void;
  onStepChange?: (cb: (index: number) => void) => void;
  getActivationVersion?: () => number;
}

/** Public API exposed for controlling the onboarding tour externally */
export interface OnboardingController {
  start: (startOptions?: { force?: boolean; startIndex?: number }) => Promise<void>;
  maybeStart: () => void;
  stop: () => void;
}
