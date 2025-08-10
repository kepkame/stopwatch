export interface LapData {
  lap: number;
  time: string;
  diff: string;
  colorIndex: number;
}

export interface LapItemProps extends LapData {
  onChangeColor: (lap: number, delta: 1 | -1) => void;
}

export interface LapListProps {
  measuring: LapData[];
  onChangeColor: (lap: number, delta: 1 | -1) => void;
}
