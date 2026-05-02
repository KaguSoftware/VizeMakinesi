export interface Tour {
  id: number;
  region: string;
  name: string;
  sub: string;
  days: string;
  group: string;
}

export interface TourFiltersProps {
  tours: Tour[];
}
