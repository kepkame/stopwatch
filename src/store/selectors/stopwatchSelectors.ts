import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';
import { formatTime } from '@utils/time/formatTime';

export const selectLaps = (s: RootState) => s.stopwatch.laps;

/** Публичный тип элемента для списка кругов */
export type LapStableItem = {
  lap: number;
  time?: string;
  diff?: string;
  colorIndex: number;
  isOpen: boolean;
  prevTs: number;
  isLatest: boolean; // this is the top element of the list
};

/** Внутренняя запись кеша per-id */
type CacheEntry = LapStableItem & {
  _deps: {
    timestampMs: number | null;
    prevTs: number;
    colorIndex: number;
    isLatest: boolean;
  };
};

const depsEqual = (a: CacheEntry['_deps'], b: CacheEntry['_deps']) =>
  a.timestampMs === b.timestampMs &&
  a.prevTs === b.prevTs &&
  a.colorIndex === b.colorIndex &&
  a.isLatest === b.isLatest;

/** per-id кеш стабильных ссылок элементов */
const CACHE_BY_ID = new Map<number, CacheEntry>();

/**
 * СТАБИЛЬНЫЙ СЕЛЕКТОР СПИСКА КРУГОВ (без .reverse()):
 *  - идём по laps с конца и формируем out[0..n-1] (новые — сверху);
 *  - isLatest = (i === n-1);
 *  - форматируем time/diff только для закрытых кругов;
 *  - сохраняем стабильные ссылки на неизменённые элементы (per-id кеш);
 *  - чистим кеш от удалённых id.
 */
export const selectLapItemsStable = createSelector(
  [selectLaps],
  (laps): ReadonlyArray<LapStableItem> => {
    const n = laps.length;
    const out: CacheEntry[] = new Array(n);
    const seen = new Set<number>();

    for (let i = n - 1, outIdx = 0; i >= 0; i--, outIdx++) {
      const src = laps[i];
      const prevTs = i === 0 ? 0 : laps[i - 1].timestampMs ?? 0;
      const isLatest = i === n - 1;
      const isOpen = src.timestampMs === null;

      const nextDeps: CacheEntry['_deps'] = {
        timestampMs: src.timestampMs,
        prevTs,
        colorIndex: src.colorIndex,
        isLatest,
      };

      const cached = CACHE_BY_ID.get(src.id);
      if (cached && depsEqual(cached._deps, nextDeps)) {
        out[outIdx] = cached;
      } else {
        let time: string | undefined;
        let diff: string | undefined;

        if (src.timestampMs !== null) {
          time = formatTime(src.timestampMs);
          diff = `+${formatTime(Math.max(0, src.timestampMs - prevTs))}`;
        }

        const entry: CacheEntry = {
          lap: src.id,
          time,
          diff,
          colorIndex: src.colorIndex,
          isOpen,
          prevTs,
          isLatest,
          _deps: nextDeps,
        };

        CACHE_BY_ID.set(src.id, entry);
        out[outIdx] = entry;
      }

      seen.add(src.id);
    }

    // очистка кеша от «сирот»
    for (const id of CACHE_BY_ID.keys()) {
      if (!seen.has(id)) CACHE_BY_ID.delete(id);
    }

    return out as ReadonlyArray<LapStableItem>;
  },
);

/**
 * Метаданные последнего круга (верх списка в UI).
 * Порядок читаем из стора (естественный), т.к. последний в сторе = верхний в UI.
 */
export const selectLatestLapMeta = createSelector([selectLaps], (laps) => {
  const n = laps.length;
  if (n === 0) return { latestId: null, latestIsOpen: false, latestPrevTs: 0 };
  const last = laps[n - 1];
  const prevTs = n - 1 === 0 ? 0 : laps[n - 2].timestampMs ?? 0;
  return {
    latestId: last.id,
    latestIsOpen: last.timestampMs === null,
    latestPrevTs: prevTs,
  };
});
