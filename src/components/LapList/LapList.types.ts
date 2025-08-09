export interface LapItemProps {
  lap: number;
  time: string;
  diff: string;
}

export interface LapListProps {
  measuring: LapItemProps[];
}
