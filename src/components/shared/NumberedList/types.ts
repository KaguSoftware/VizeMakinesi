export interface NumberedListItem {
  text: string;
  title?: string;
}

export interface NumberedListProps {
  items: (string | NumberedListItem)[];
}
