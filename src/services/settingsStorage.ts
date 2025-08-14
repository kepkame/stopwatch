/**
 * Centralized persistence layer for user settings.
 * Decoupled from Redux for use in any part of the app.
 * Handles schema versioning, normalization, and cleanup of non-persistent fields.
 */

// Current storage schema version for compatibility checks
const SCHEMA_VERSION = 1 as const;

export type SettingsPersistedCurrent = {
  _v: typeof SCHEMA_VERSION;
  soundEnabled: boolean;
  alertIntervalSec: number;
  changeTimeByTap: boolean;
  keepScreenOn: boolean;
  theme: string;
};

// LocalStorage key for all persisted settings (no environment-based variants)
const STORAGE_KEY = 'stopwatch:settings';

/**
 * Determines if a value is a plain object (non-null, non-array).
 * Used as a strict type guard before attempting migrations.
 */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Normalizes the data to the current schema version.
 */
function normalizeToCurrent(
  anyData: Record<string, unknown>
): SettingsPersistedCurrent {
  const bool = (x: unknown, df = false) => (typeof x === 'boolean' ? x : df);
  const num = (x: unknown, df = 60) =>
    typeof x === 'number' && Number.isFinite(x) ? x : df;
  const str = (x: unknown, df = 'default') => (typeof x === 'string' ? x : df);

  return {
    _v: SCHEMA_VERSION,
    soundEnabled: bool(anyData.soundEnabled, false),
    alertIntervalSec: num(anyData.alertIntervalSec, 60),
    changeTimeByTap: bool(anyData.changeTimeByTap, true),
    keepScreenOn: bool(anyData.keepScreenOn, false),
    theme: str(anyData.theme, 'default'),
  };
}

/**
 * Migrations for different schema versions.
 */
const MIGRATIONS: Readonly<
  Record<number, (d: Record<string, unknown>) => Record<string, unknown>>
> = {
  // 1: (d) => ({ ...d, _v: 2, ...changes }),
};

/**
 * Migrates data from a previous schema version to the current one.
 */
function migrateToCurrent(raw: unknown): SettingsPersistedCurrent | null {
  if (!isPlainObject(raw)) return null;

  // Determine the source version
  const vValue = raw._v;
  let fromVersion = 1; // default to the earliest version
  if (typeof vValue === 'number' && Number.isInteger(vValue) && vValue >= 1) {
    fromVersion = vValue;
  }

  if (fromVersion > SCHEMA_VERSION) {
    return null;
  }

  // Apply migrations sequentially (fromVersion -> ... -> SCHEMA_VERSION)
  let data: Record<string, unknown> = raw;
  while (fromVersion < SCHEMA_VERSION) {
    const migrate = MIGRATIONS[fromVersion];
    if (!migrate) {
      return null;
    }
    data = migrate(data);
    fromVersion += 1;
  }

  return normalizeToCurrent(data);
}

/**
 * Parses JSON with error handling.
 * Returns `null` instead of throwing on malformed data.
 */
function parseJSON(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Retrieves persisted settings and applies migrations.
 * Returns a partial object for merging with default settings.
 */
export function loadSettings(): Partial<SettingsPersistedCurrent> {
  try {
    const parsed = parseJSON(localStorage.getItem(STORAGE_KEY));
    const migrated = migrateToCurrent(parsed);
    return migrated ?? {};
  } catch {
    return {};
  }
}

/**
 * Persists settings to LocalStorage.
 * Accepts either a full settings object or a partial slice;
 * normalization ensures type safety and filters out non-persistent fields.
 */
export function saveSettings(input: Record<string, unknown>): void {
  try {
    const normalized = normalizeToCurrent(input);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Fail silently to avoid breaking the app on storage errors
  }
}

/**
 * Removes all persisted settings, typically used during a full app reset.
 */
export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}
