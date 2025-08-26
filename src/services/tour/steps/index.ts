import type { Store } from '@reduxjs/toolkit';
import {
  buildStartStep,
  buildLapStep,
  buildGroupStep,
  buildSwitchTimeStep,
  buildSettingsStep,
} from './builders';
import type { DriverAdapter, StepDefinition } from '../types';

/**
 * Create the full, ordered list of onboarding steps.
 * Order must match StepId indexes used by builders.
 */
export const createSteps = (
  store: Store,
  adapterProvider?: { getAdapter?: () => DriverAdapter | null },
): StepDefinition[] => {
  const stepDeps = { store, getAdapter: adapterProvider?.getAdapter };
  return [
    buildStartStep(stepDeps),
    buildLapStep(stepDeps),
    buildGroupStep(stepDeps),
    buildSwitchTimeStep(stepDeps),
    buildSettingsStep(stepDeps),
  ];
};
