import type { LapStableItem } from '@store/selectors/stopwatchSelectors';

export type LapColorHandler = (lapId: number, delta: 1 | -1) => void;

export interface LapItemProps extends LapStableItem {
  onChangeColor: LapColorHandler;
}

export interface LapListProps {
  measuring: ReadonlyArray<LapStableItem>;
  onChangeColor: LapColorHandler;
}
