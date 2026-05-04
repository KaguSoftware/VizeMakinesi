export interface NavItem {
  to: string;
  label: string;
  flag?: string;
  desc?: string;
}

export interface MegaColumn {
  kind?: 'feature';
  title?: string;
  items?: NavItem[];
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    to: string;
  };
}

export interface MegaMenuGroup {
  label: string;
  columns: MegaColumn[];
}

export interface MobileLink {
  to: string;
  label: string;
  end?: boolean;
}
