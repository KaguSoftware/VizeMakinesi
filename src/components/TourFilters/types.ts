export interface Tour {
  id: number;
  region: string;
  name: string;
  sub: string;
  days: string;
  group: string;
  price: string;
}

export interface TourFiltersProps {
  tours: Tour[];
}
