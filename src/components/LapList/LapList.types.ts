export interface LapItemProps {
  lap: number;
  time: string;
  diff: string;
  colorIndex: number;
}

export interface LapListProps {
  measuring: LapItemProps[];
}
