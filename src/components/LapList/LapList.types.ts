export interface LapData {
  lap: number;
  time?: string;
  diff?: string;
  colorIndex: number;
}

export interface LapMeasuring extends LapData {
  prevTs: number;
  isOpen: boolean;
}

export interface LapItemProps extends LapMeasuring {
  onChangeColor: (lap: number, delta: 1 | -1) => void;
  isLatest?: boolean;
}

export interface LapListProps {
  measuring: LapMeasuring[];
  onChangeColor: (lap: number, delta: 1 | -1) => void;
}
