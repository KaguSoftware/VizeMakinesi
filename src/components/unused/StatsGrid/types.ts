export interface StatItem {
  n: string;
  label: string;
}

export interface StatsGridProps {
  items: StatItem[];
  onDark?: boolean;
}
