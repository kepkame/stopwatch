import type { Store } from '@reduxjs/toolkit';
import type { DriverAdapter } from '../types';

export type StepDeps = {
  store: Store;
  getAdapter?: () => DriverAdapter | null;
};
