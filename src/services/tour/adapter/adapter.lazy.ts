import { buildAdapterFromRaw } from './adapter.shared';
import type { DriverUserOptions, DriverAdapter, RawDriverInstance } from '../types';

type DriverJsModule = {
  driver: (options: DriverUserOptions) => unknown;
};

// Memoized dynamic-imports to avoid duplicate JS/CSS loads.
let driverModulePromise: Promise<DriverJsModule> | null = null;
let cssLoadedPromise: Promise<unknown> | null = null;

/**
 * Lazily load driver.js + theme CSS and return a stable adapter.
 */
export const createDriverAdapterLazy = async (
  options: DriverUserOptions,
): Promise<DriverAdapter> => {
  if (!driverModulePromise) {
    driverModulePromise = import('driver.js') as Promise<DriverJsModule>;
  }
  if (!cssLoadedPromise) {
    cssLoadedPromise = import('@styles/third-party/_driver-theme.scss');
  }
  const [{ driver: createRawDriver }] = await Promise.all([driverModulePromise, cssLoadedPromise]);

  // The upstream factory is untyped; narrow intentionally to our minimal RawDriverInstance.
  const raw = (createRawDriver as unknown as (options: DriverUserOptions) => unknown)(
    options,
  ) as RawDriverInstance;

  return buildAdapterFromRaw(raw);
};

/**
 * Clears cached imports so the next call reloads `driver.js` and CSS.
 */
export const resetDriverAdapterCache = (): void => {
  driverModulePromise = null;
  cssLoadedPromise = null;
};
